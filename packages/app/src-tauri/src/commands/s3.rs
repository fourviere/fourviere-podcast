use ::function_name::named;
use get_chunk::{
    data_size_format::si::{SISize, SIUnit},
    stream::{FileStream, StreamExt},
};
use s3::{creds::Credentials, serde_types::Part, Bucket, Region};
use serde::Deserialize;
use tauri::AppHandle;
use tauri_plugin_channel::Channel;
use tokio::{fs, select, spawn, task::JoinSet};
use tokio_util::sync::CancellationToken;

use crate::{
    log_if_error_and_return,
    utils::{
        event::{Command, CommandReceiver, Event, EventProducer},
        result::{Error, Result},
    },
};

use super::common::{build_channel, build_local_channel, RemoteFileInfo, Uploadable};

#[derive(Deserialize)]
struct S3Connection {
    bucket_name: String,
    region: String,
    endpoint: String,
    access_key: String,
    secret_key: String,
}

impl S3Connection {
    fn bucket(&self) -> Result<Bucket> {
        let credentials = Credentials::new(
            Some(&self.access_key),
            Some(&self.secret_key),
            None,
            None,
            None,
        )?;

        Bucket::new(
            &self.bucket_name,
            Region::Custom {
                region: self.region.clone(),
                endpoint: self.endpoint.clone(),
            },
            credentials,
        )
        .map_err(|err| err.into())
    }
}
#[derive(Deserialize)]
pub struct UploadableConf {
    #[serde(flatten)]
    connection: S3Connection,

    #[serde(flatten)]
    uploadable: Uploadable,
}

#[tauri::command]
pub async fn s3_upload_progress(app_handle: AppHandle, uploadable_conf: UploadableConf) -> Channel {
    let (producer, receiver, channel) = build_channel(app_handle);
    s3_upload_progress_internal(producer, receiver, uploadable_conf, false);
    channel
}

#[named]
fn s3_upload_progress_internal(
    mut producer: EventProducer,
    receiver: CommandReceiver,
    uploadable_conf: UploadableConf,
    use_path_style: bool,
) {
    spawn(async move {
        let result =
            s3_upload_progress_task(&mut producer, receiver, uploadable_conf, use_path_style)
                .await
                .map(Event::FileResult);
        log_if_error_and_return!(&result);
        producer.send(result).await;
    });
}

async fn s3_upload_progress_task(
    producer: &mut EventProducer,
    receiver: CommandReceiver,
    mut uploadable_conf: UploadableConf,
    use_path_style: bool,
) -> Result<RemoteFileInfo> {
    let _ = receiver.started().await;

    // Init Phase
    producer.send(Ok(Event::Progress(0))).await;

    let mut bucket = uploadable_conf.connection.bucket()?;

    // this header is required to make the uploaded file public readable.
    bucket.add_header("x-amz-acl", "public-read");

    //Useful for testing/old S3 implementation
    if use_path_style {
        bucket.set_path_style();
    }

    producer.send(Ok(Event::DeltaProgress(2))).await;

    let local_path = uploadable_conf.uploadable.local_path().await?;

    let remote_file_path = uploadable_conf.uploadable.remote_file_path();

    let file_info = uploadable_conf.uploadable.local_file_info()?;

    producer.send(Ok(Event::DeltaProgress(5))).await;

    // Transfer phase: 80-88%

    // Each part must be at least 5 MB in size, except the last part.
    // https://docs.aws.amazon.com/AmazonS3/latest/userguide/qfacts.html
    let min_chunck_size = SIUnit::new(6., SISize::Megabyte);
    let mut file_stream = FileStream::new(local_path.to_string_lossy())
        .await?
        .set_mode(get_chunk::ChunkSize::Bytes(min_chunck_size.into()));

    let chunk_number = <SIUnit as Into<f64>>::into(
        SIUnit::auto(file_stream.get_file_size()) / min_chunck_size.into(),
    )
    .floor() as u16;

    // File <= 5MB
    if chunk_number < 2 {
        let file = fs::read(local_path).await?;
        bucket
            .put_object_with_content_type(remote_file_path, &file, &file_info.mime_type)
            .await?;

        producer.send(Ok(Event::DeltaProgress(80))).await;
    } else {
        let mut set: JoinSet<Result<Part>> = JoinSet::new();
        let mut parts_result: Vec<Part> = Vec::new();
        let delta_progress = 80 / (1 + chunk_number) as u8;

        // Part number of part being uploaded. This is a positive integer between 1 and 10,000.
        // https://docs.aws.amazon.com/AmazonS3/latest/API/API_UploadPart.html#API_UploadPart_RequestSyntax
        let mut index = 1;

        let upload_response = bucket
            .initiate_multipart_upload(&remote_file_path, &file_info.mime_type)
            .await?;

        let canc_token: CancellationToken = receiver.into();

        while let Ok(Some(chunk)) = file_stream.try_next().await {
            // Prepare data for the part upload task
            let mut event_producer = producer.clone();
            let bucket = bucket.clone();
            let new_file_name = remote_file_path.clone();
            let upload_id = upload_response.upload_id.clone();
            let mime_type = file_info.mime_type.clone();
            let canc_token = canc_token.clone();

            set.spawn(async move {
                select! {
                    _ = canc_token.cancelled() => {
                        let _ = bucket.abort_upload(&new_file_name, &upload_id).await;
                        Err(Error::Aborted)
                    },
                    res = bucket
                    .put_multipart_chunk(chunk, &new_file_name, index, &upload_id, &mime_type) => {
                        event_producer.send(Ok(Event::DeltaProgress(delta_progress))).await;
                        res.map_err(|err| err.into())
                    }
                }
            });
            index += 1;
        }

        while let Some(res) = set.join_next().await {
            parts_result.push(res??);
        }

        // The parts list must be specified in order by part number
        // https://docs.aws.amazon.com/AmazonS3/latest/API/API_CompleteMultipartUpload.html#API_CompleteMultipartUpload_RequestSyntax
        parts_result.sort_by(|a, b| a.part_number.cmp(&b.part_number));

        bucket
            .complete_multipart_upload(&remote_file_path, &upload_response.upload_id, parts_result)
            .await?;
    }

    // Fin phase: 5%
    producer.send(Ok(Event::Progress(95))).await;

    let file_info = uploadable_conf.uploadable.remote_file_info()?;

    producer.send(Ok(Event::DeltaProgress(5))).await;

    Ok(file_info)
}

#[named]
#[tauri::command]
pub async fn s3_upload(uploadable_conf: UploadableConf) -> Result<RemoteFileInfo> {
    let upload_result = s3_upload_internal(uploadable_conf, false).await;
    log_if_error_and_return!(upload_result)
}

async fn s3_upload_internal(
    uploadable_conf: UploadableConf,
    use_path_style: bool,
) -> Result<RemoteFileInfo> {
    let (producer, receiver, mut rx_event, tx_command) = build_local_channel();
    s3_upload_progress_internal(producer, receiver, uploadable_conf, use_path_style);
    let _ = tx_command.send(Command::Start).await;

    while let Some(data) = rx_event.recv().await {
        match data {
            Ok(Event::FileResult(res)) => return Ok(res),
            Ok(_) => (),
            Err(err) => return Err(err),
        }
    }

    Err(Error::Aborted)
}

#[cfg(test)]
mod test {
    use std::{net::TcpListener, time::Duration};

    use hyper::Server;
    use s3::{creds::Credentials, Bucket, BucketConfiguration, Region};
    use s3s::{auth::SimpleAuth, service::S3ServiceBuilder};
    use s3s_fs::FileSystem;
    use tempfile::tempdir;
    use tokio::{spawn, time::sleep};

    use crate::{
        commands::{
            common::{build_local_channel, RemoteUploadableConf, Uploadable},
            s3::{s3_upload_internal, s3_upload_progress_internal, S3Connection, UploadableConf},
        },
        test_file,
        utils::event::Command,
    };

    const ACCESS_KEY: &str = "StealThisUselessAccessKey";
    const SECRET_KEY: &str = "StealThisUselessSecretKey";
    const REGION: &str = "wonderland";

    #[cfg(target_os = "windows")]
    const FILESIZE: u64 = 9156;

    #[cfg(target_os = "linux")]
    const FILESIZE: u64 = 9063;

    #[cfg(target_os = "macos")]
    const FILESIZE: u64 = 9063;

    async fn s3_server(port: u16) {
        let tmp_dir = tempdir().unwrap();
        let fs = FileSystem::new(tmp_dir.path()).unwrap();

        // Setup S3 service
        let service = {
            let mut b = S3ServiceBuilder::new(fs);
            b.set_auth(SimpleAuth::from_single(ACCESS_KEY, SECRET_KEY));
            b.set_base_domain(&("localhost:".to_owned() + port.to_string().as_str()));
            b.build()
        };

        let listener = TcpListener::bind(("localhost", port)).unwrap();
        let _ = Server::from_tcp(listener)
            .unwrap()
            .serve(service.into_shared().into_make_service())
            .await;
    }

    async fn prepare_s3_bucket(port: u16, bucket: &str) {
        let bucket = Bucket::create_with_path_style(
            bucket,
            Region::Custom {
                region: REGION.to_owned(),
                endpoint: "http://localhost:".to_owned() + port.to_string().as_str(),
            },
            Credentials::new(Some(ACCESS_KEY), Some(SECRET_KEY), None, None, None).unwrap(),
            BucketConfiguration::default(),
        )
        .await;
        let test_error = bucket.as_ref().is_err_and(|err| {
            if let s3::error::S3Error::Http(409, _) = err {
                true
            } else {
                false
            }
        }) || bucket.is_ok();
        assert!(bucket.is_ok() || test_error);
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_s3_upload_ok() {
        let port = 3121;
        let bucket = "test-ok";
        let domain = "http://localhost:".to_owned() + port.to_string().as_str();
        let uploadable_conf = UploadableConf {
            connection: S3Connection {
                bucket_name: bucket.to_owned(),
                region: REGION.to_owned(),
                endpoint: domain.clone(),
                access_key: ACCESS_KEY.to_owned(),
                secret_key: SECRET_KEY.to_owned(),
            },
            uploadable: Uploadable::new(
                None,
                std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                    .ok()
                    .map(|val| val.to_owned()),
                RemoteUploadableConf::new("gitbar".to_owned(), None, domain, false),
            ),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        prepare_s3_bucket(port, bucket).await;

        let info_result = s3_upload_internal(uploadable_conf, true).await;
        assert!(info_result.is_ok());
        let file_info = info_result.unwrap();
        assert_eq!(file_info.size(), &FILESIZE);
        assert_eq!(file_info.mime_type(), "application/octet-stream");

        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_s3_upload_err_host() {
        let port = 3122;
        let bucket = "test-err-host";
        let domain = "https://localhost:".to_owned() + port.to_string().as_str();
        let uploadable_conf = UploadableConf {
            connection: S3Connection {
                bucket_name: bucket.to_owned(),
                region: REGION.to_owned(),
                endpoint: domain.clone(),
                access_key: ACCESS_KEY.to_owned(),
                secret_key: SECRET_KEY.to_owned(),
            },
            uploadable: Uploadable::new(
                None,
                std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                    .ok()
                    .map(|val| val.to_owned()),
                RemoteUploadableConf::new("gitbar".to_owned(), None, domain, false),
            ),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        prepare_s3_bucket(port, bucket).await;
        assert!(s3_upload_internal(uploadable_conf, true).await.is_err());
        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_s3_upload_err_local_path() {
        let port = 3123;
        let bucket = "test-err-local-path";
        let domain = "http://localhost:".to_owned() + port.to_string().as_str();
        let uploadable_conf = UploadableConf {
            connection: S3Connection {
                bucket_name: bucket.to_owned(),
                region: REGION.to_owned(),
                endpoint: domain.clone(),
                access_key: ACCESS_KEY.to_owned(),
                secret_key: SECRET_KEY.to_owned(),
            },
            uploadable: Uploadable::new(
                Some(test_file!("gitbar.rss").into()),
                None,
                RemoteUploadableConf::new("gitbar".to_owned(), None, domain, false),
            ),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        prepare_s3_bucket(port, bucket).await;
        assert!(s3_upload_internal(uploadable_conf, true).await.is_err());
        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_s3_upload_err_bucket() {
        let port = 3124;
        let domain = "http://localhost:".to_owned() + port.to_string().as_str();
        let uploadable_conf = UploadableConf {
            connection: S3Connection {
                bucket_name: "not_a_bucket".to_owned(),
                region: REGION.to_owned(),
                endpoint: domain.clone(),
                access_key: ACCESS_KEY.to_owned(),
                secret_key: SECRET_KEY.to_owned(),
            },
            uploadable: Uploadable::new(
                None,
                std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                    .ok()
                    .map(|val| val.to_owned()),
                RemoteUploadableConf::new("gitbar".to_owned(), None, domain, false),
            ),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        assert!(s3_upload_internal(uploadable_conf, true).await.is_err());
        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_s3_upload_progress_ok() {
        let port = 3125;
        let bucket = "test-ok";
        let domain = "http://localhost:".to_owned() + port.to_string().as_str();
        let uploadable_conf = UploadableConf {
            connection: S3Connection {
                bucket_name: bucket.to_owned(),
                region: REGION.to_owned(),
                endpoint: domain.clone(),
                access_key: ACCESS_KEY.to_owned(),
                secret_key: SECRET_KEY.to_owned(),
            },
            uploadable: Uploadable::new(
                Some(test_file!("gitbar.xml").into()),
                None,
                RemoteUploadableConf::new("gitbar".to_owned(), None, domain, false),
            ),
        };
        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        prepare_s3_bucket(port, bucket).await;

        let (producer, receiver, mut rx_event, tx_command) = build_local_channel();
        let _ = tx_command.send(Command::Start).await;
        s3_upload_progress_internal(producer, receiver, uploadable_conf, true);

        let mut at_least_one_progress = false;
        let mut at_least_one_result = false;

        while let Some(event) = rx_event.recv().await {
            match event {
                Ok(event) => match event {
                    crate::utils::event::Event::Progress(_) => at_least_one_progress = true,
                    crate::utils::event::Event::FileResult(file_info) => {
                        assert_eq!(file_info.size(), &FILESIZE);
                        assert_eq!(file_info.mime_type(), "text/xml");
                        at_least_one_result = true;
                    }
                    _ => panic!("Event not allowed: {:?}", event),
                },
                Err(err) => panic!("{:?}", err),
            }
        }

        assert!(at_least_one_progress);
        assert!(at_least_one_result);

        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_s3_upload_progress_err_host() {
        let port = 3126;
        let bucket = "test-err-host";
        let domain = "https://localhost:".to_owned() + port.to_string().as_str();
        let uploadable_conf = UploadableConf {
            connection: S3Connection {
                bucket_name: bucket.to_owned(),
                region: REGION.to_owned(),
                endpoint: domain.clone(),
                access_key: ACCESS_KEY.to_owned(),
                secret_key: SECRET_KEY.to_owned(),
            },
            uploadable: Uploadable::new(
                None,
                std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                    .ok()
                    .map(|val| val.to_owned()),
                RemoteUploadableConf::new("gitbar".to_owned(), None, domain, false),
            ),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        prepare_s3_bucket(port, bucket).await;

        let (producer, receiver, mut rx_event, tx_command) = build_local_channel();
        let _ = tx_command.send(Command::Start).await;
        s3_upload_progress_internal(producer, receiver, uploadable_conf, true);

        let mut at_least_one_error = false;

        while let Some(event) = rx_event.recv().await {
            match event {
                Ok(_) => (),
                Err(_) => at_least_one_error = true,
            }
        }

        assert!(at_least_one_error);

        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_s3_upload_progress_err_local_path() {
        let port = 3127;
        let bucket = "test-err-local-path";
        let domain = "http://localhost:".to_owned() + port.to_string().as_str();
        let uploadable_conf = UploadableConf {
            connection: S3Connection {
                bucket_name: bucket.to_owned(),
                region: REGION.to_owned(),
                endpoint: domain.clone(),
                access_key: ACCESS_KEY.to_owned(),
                secret_key: SECRET_KEY.to_owned(),
            },
            uploadable: Uploadable::new(
                Some(test_file!("gitbar.rss").into()),
                None,
                RemoteUploadableConf::new("gitbar".to_owned(), None, domain, false),
            ),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        prepare_s3_bucket(port, bucket).await;

        let (producer, receiver, mut rx_event, tx_command) = build_local_channel();
        let _ = tx_command.send(Command::Start).await;
        s3_upload_progress_internal(producer, receiver, uploadable_conf, true);

        let mut at_least_one_error = false;

        while let Some(event) = rx_event.recv().await {
            match event {
                Ok(_) => (),
                Err(_) => at_least_one_error = true,
            }
        }

        assert!(at_least_one_error);

        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_s3_upload_progress_err_bucket() {
        let port = 3128;
        let domain = "http://localhost:".to_owned() + port.to_string().as_str();
        let uploadable_conf = UploadableConf {
            connection: S3Connection {
                bucket_name: "not_a_bucket".to_owned(),
                region: REGION.to_owned(),
                endpoint: domain.clone(),
                access_key: ACCESS_KEY.to_owned(),
                secret_key: SECRET_KEY.to_owned(),
            },
            uploadable: Uploadable::new(
                None,
                std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                    .ok()
                    .map(|val| val.to_owned()),
                RemoteUploadableConf::new("gitbar".to_owned(), None, domain, false),
            ),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;

        let (producer, receiver, mut rx_event, tx_command) = build_local_channel();
        let _ = tx_command.send(Command::Start).await;
        s3_upload_progress_internal(producer, receiver, uploadable_conf, true);

        let mut at_least_one_error = false;

        while let Some(event) = rx_event.recv().await {
            match event {
                Ok(_) => (),
                Err(_) => at_least_one_error = true,
            }
        }

        assert!(at_least_one_error);

        handle.abort();
    }

    /// Can be used as local server for E2E test using use_path_style = true
    #[ignore]
    #[tokio::test(flavor = "multi_thread")]
    async fn test_s3_e2e() {
        let port = 3125;
        let bucket = "test-ok";
        let _handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        prepare_s3_bucket(port, bucket).await;

        loop {
            sleep(Duration::from_secs(10)).await;
        }
    }
}
