use ::function_name::named;
use get_chunk::iterator::FileIter;
use s3::{creds::Credentials, Bucket, Region};
use serde::Deserialize;
use std::{borrow::Cow, path::Path};
use tauri::Window;
use tokio::{fs, spawn, task::JoinSet};
use uuid::Uuid;

use crate::{
    log_if_error_and_return,
    utils::{
        event::{Channel, Event, EventProducer},
        file::{get_file_info, write_string_to_temp_file, TempFile},
        result::Result,
    },
};

use super::common::{EndPointPayloadConf, FileInfo};

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
pub struct FilePayload {
    local_path: String,

    #[serde(flatten)]
    connection: S3Connection,

    #[serde(flatten)]
    endpoint_config: EndPointPayloadConf,
}

#[derive(serde::Deserialize)]
pub struct XmlPayload {
    content: String,

    #[serde(flatten)]
    connection: S3Connection,

    #[serde(flatten)]
    endpoint_config: EndPointPayloadConf,
}

#[named]
#[tauri::command]
pub async fn s3_xml_upload_window_progress(window: Window, payload: XmlPayload) -> Result<Uuid> {
    let result = s3_xml_upload_progress_internal(window.into(), payload, false).await;
    log_if_error_and_return!(result)
}

#[tauri::command]
pub async fn s3_upload_window_progress(window: Window, payload: FilePayload) -> Uuid {
    s3_upload_progress_internal(window.into(), payload, None, false)
}

async fn s3_xml_upload_progress_internal(
    channel: Channel,
    payload: XmlPayload,
    use_path_style: bool,
) -> Result<Uuid> {
    let temp_file = write_string_to_temp_file(&payload.content, "xml").await?;

    let file_payload = FilePayload {
        local_path: temp_file.path().to_owned(),
        connection: payload.connection,
        endpoint_config: payload.endpoint_config,
    };

    Ok(s3_upload_progress_internal(
        channel,
        file_payload,
        Some(temp_file),
        use_path_style,
    ))
}

#[named]
fn s3_upload_progress_internal(
    channel: Channel,
    payload: FilePayload,
    temp_file: Option<TempFile>,
    use_path_style: bool,
) -> Uuid {
    let mut event_producer = EventProducer::new(channel);
    let id = event_producer.id();

    spawn(async move {
        let result =
            s3_upload_progress_task(&mut event_producer, payload, temp_file, use_path_style)
                .await
                .map(Event::FileResult);
        log_if_error_and_return!(&result);
        event_producer.send(result).await;
    });
    id
}

async fn s3_upload_progress_task(
    event_producer: &mut EventProducer,
    payload: FilePayload,
    _temp_file: Option<TempFile>,
    use_path_style: bool,
) -> Result<FileInfo> {
    // Init Phase
    event_producer.send(Ok(Event::Progress(0))).await;

    let mut bucket = payload.connection.bucket()?;

    // this header is required to make the uploaded file public readable.
    bucket.add_header("x-amz-acl", "public-read");

    //Useful for testing/old S3 implementation
    if use_path_style {
        bucket.set_path_style();
    }

    event_producer.send(Ok(Event::DeltaProgress(2))).await;

    let ext = Path::new(&payload.local_path)
        .extension()
        .map_or(Cow::default(), |ext| ext.to_string_lossy());

    let path = payload
        .endpoint_config
        .path()
        .as_ref()
        .unwrap_or(&"".to_owned())
        .to_owned();
    let new_file_name: String = format!(
        "{}/{}.{}",
        &path,
        &payload.endpoint_config.file_name(),
        &ext
    );

    let file_info = get_file_info(&payload.local_path).await?;

    event_producer.send(Ok(Event::DeltaProgress(5))).await;

    // Transfer phase: 80-88%

    // Step by 8%
    let file_iter =
        FileIter::new(payload.local_path.as_ref())?.set_mode(get_chunk::ChunkSize::Percent(10.));

    let upload_response = bucket
        .initiate_multipart_upload(&new_file_name, &file_info.mime_type)
        .await?;

    let mut set: JoinSet<Result<()>> = JoinSet::new();

    for (index, chunk) in file_iter.enumerate() {
        // Prepare data for the part upload task
        let chunk = chunk?;
        let mut event_producer = event_producer.clone();
        let bucket = bucket.clone();
        let new_file_name = new_file_name.clone();
        let upload_id = upload_response.upload_id.clone();
        let mime_type = file_info.mime_type.clone();

        set.spawn(async move {
            bucket
                .put_multipart_chunk(chunk, &new_file_name, index as u32, &upload_id, &mime_type)
                .await?;

            event_producer.send(Ok(Event::DeltaProgress(8))).await;
            Ok(())
        });

        while let Some(res) = set.join_next().await {
            res??;
        }
    }

    bucket
        .complete_multipart_upload(&new_file_name, &upload_response.upload_id, Vec::new())
        .await?;

    // Fin phase: 5%
    event_producer.send(Ok(Event::Progress(95))).await;

    let file_info = FileInfo::new(&payload.endpoint_config, &file_info, &ext);

    event_producer.send(Ok(Event::DeltaProgress(5))).await;

    Ok(file_info)
}

#[named]
#[tauri::command]
pub async fn s3_xml_upload(payload: XmlPayload) -> Result<FileInfo> {
    let upload_result = s3_xml_upload_internal(payload, false).await;
    log_if_error_and_return!(upload_result)
}

#[named]
#[tauri::command]
pub async fn s3_upload(payload: FilePayload) -> Result<FileInfo> {
    let upload_result = s3_upload_internal(payload, false).await;
    log_if_error_and_return!(upload_result)
}

async fn s3_xml_upload_internal(payload: XmlPayload, use_path_style: bool) -> Result<FileInfo> {
    let temp_file = write_string_to_temp_file(&payload.content, "xml").await?;

    let file_payload = FilePayload {
        local_path: temp_file.path().to_owned(),
        connection: payload.connection,
        endpoint_config: payload.endpoint_config,
    };

    s3_upload_internal(file_payload, use_path_style).await
}

async fn s3_upload_internal(payload: FilePayload, use_path_style: bool) -> Result<FileInfo> {
    let mut bucket = payload.connection.bucket()?;

    // this header is required to make the uploaded file public readable.
    bucket.add_header("x-amz-acl", "public-read");

    //Useful for testing/old S3 implementation
    if use_path_style {
        bucket.set_path_style();
    }

    let file = fs::read(&payload.local_path).await?;
    let file_info = get_file_info(&payload.local_path).await?;

    let ext = Path::new(&payload.local_path)
        .extension()
        .map_or(Cow::default(), |ext| ext.to_string_lossy());

    let path = payload
        .endpoint_config
        .path()
        .as_ref()
        .unwrap_or(&"".to_owned())
        .to_owned();
    let new_file_name = format!(
        "{}/{}.{}",
        &path,
        &payload.endpoint_config.file_name(),
        &ext
    );

    bucket
        .put_object_with_content_type(new_file_name, &file, &file_info.mime_type)
        .await?;

    Ok(FileInfo::new(&payload.endpoint_config, &file_info, &ext))
}

#[cfg(test)]
mod test {
    use std::{net::TcpListener, time::Duration};

    use hyper::Server;
    use s3::{creds::Credentials, Bucket, BucketConfiguration, Region};
    use s3s::{auth::SimpleAuth, service::S3ServiceBuilder};
    use s3s_fs::FileSystem;
    use tempfile::tempdir;
    use tokio::{spawn, sync::mpsc::channel, time::sleep};

    use crate::{
        commands::{
            common::EndPointPayloadConf,
            s3::{
                s3_upload_internal, s3_upload_progress_internal, s3_xml_upload_internal,
                s3_xml_upload_progress_internal, FilePayload, S3Connection, XmlPayload,
            },
        },
        test_file,
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
        let payload = XmlPayload {
            content: std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                .unwrap_or_default()
                .to_owned(),
            connection: S3Connection {
                bucket_name: bucket.to_owned(),
                region: REGION.to_owned(),
                endpoint: domain.clone(),
                access_key: ACCESS_KEY.to_owned(),
                secret_key: SECRET_KEY.to_owned(),
            },
            endpoint_config: EndPointPayloadConf::new("gitbar".to_owned(), None, domain, false),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        prepare_s3_bucket(port, bucket).await;

        let info_result = s3_xml_upload_internal(payload, true).await;
        assert!(info_result.is_ok());
        let file_info = info_result.unwrap();
        assert_eq!(file_info.size(), &FILESIZE);
        assert_eq!(file_info.mime_type(), "text/xml");

        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_s3_upload_err_host() {
        let port = 3122;
        let bucket = "test-err-host";
        let domain = "https://localhost:".to_owned() + port.to_string().as_str();
        let payload = XmlPayload {
            content: std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                .unwrap_or_default()
                .to_owned(),
            connection: S3Connection {
                bucket_name: bucket.to_owned(),
                region: REGION.to_owned(),
                endpoint: domain.clone(),
                access_key: ACCESS_KEY.to_owned(),
                secret_key: SECRET_KEY.to_owned(),
            },
            endpoint_config: EndPointPayloadConf::new("gitbar".to_owned(), None, domain, false),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        prepare_s3_bucket(port, bucket).await;
        assert!(s3_xml_upload_internal(payload, true).await.is_err());
        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_s3_upload_err_local_path() {
        let port = 3123;
        let bucket = "test-err-local-path";
        let domain = "http://localhost:".to_owned() + port.to_string().as_str();
        let payload = FilePayload {
            local_path: test_file!("gitbar.rss").to_owned(),
            connection: S3Connection {
                bucket_name: bucket.to_owned(),
                region: REGION.to_owned(),
                endpoint: domain.clone(),
                access_key: ACCESS_KEY.to_owned(),
                secret_key: SECRET_KEY.to_owned(),
            },
            endpoint_config: EndPointPayloadConf::new("gitbar".to_owned(), None, domain, false),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        prepare_s3_bucket(port, bucket).await;
        assert!(s3_upload_internal(payload, true).await.is_err());
        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_s3_upload_err_bucket() {
        let port = 3124;
        let domain = "http://localhost:".to_owned() + port.to_string().as_str();
        let payload = XmlPayload {
            content: std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                .unwrap_or_default()
                .to_owned(),
            connection: S3Connection {
                bucket_name: "not_a_bucket".to_owned(),
                region: REGION.to_owned(),
                endpoint: domain.clone(),
                access_key: ACCESS_KEY.to_owned(),
                secret_key: SECRET_KEY.to_owned(),
            },
            endpoint_config: EndPointPayloadConf::new("gitbar".to_owned(), None, domain, false),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        assert!(s3_xml_upload_internal(payload, true).await.is_err());
        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_s3_upload_progress_ok() {
        let port = 3125;
        let bucket = "test-ok";
        let domain = "http://localhost:".to_owned() + port.to_string().as_str();
        let payload = XmlPayload {
            content: std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                .unwrap_or_default()
                .to_owned(),
            connection: S3Connection {
                bucket_name: bucket.to_owned(),
                region: REGION.to_owned(),
                endpoint: domain.clone(),
                access_key: ACCESS_KEY.to_owned(),
                secret_key: SECRET_KEY.to_owned(),
            },
            endpoint_config: EndPointPayloadConf::new("gitbar".to_owned(), None, domain, false),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        prepare_s3_bucket(port, bucket).await;

        let (tx, mut rx) = channel(2);
        let original_id = s3_xml_upload_progress_internal(tx.into(), payload, true)
            .await
            .unwrap();
        let mut at_least_one_progress = false;
        let mut at_least_one_result = false;

        while let Some((id, event)) = rx.recv().await {
            assert_eq!(original_id, id);
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
        let payload = XmlPayload {
            content: std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                .unwrap_or_default()
                .to_owned(),
            connection: S3Connection {
                bucket_name: bucket.to_owned(),
                region: REGION.to_owned(),
                endpoint: domain.clone(),
                access_key: ACCESS_KEY.to_owned(),
                secret_key: SECRET_KEY.to_owned(),
            },
            endpoint_config: EndPointPayloadConf::new("gitbar".to_owned(), None, domain, false),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        prepare_s3_bucket(port, bucket).await;

        let (tx, mut rx) = channel(2);
        let original_id = s3_xml_upload_progress_internal(tx.into(), payload, true)
            .await
            .unwrap();
        let mut at_least_one_error = false;

        while let Some((id, event)) = rx.recv().await {
            assert_eq!(original_id, id);
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
        let payload = FilePayload {
            local_path: test_file!("gitbar.rss").to_owned(),
            connection: S3Connection {
                bucket_name: bucket.to_owned(),
                region: REGION.to_owned(),
                endpoint: domain.clone(),
                access_key: ACCESS_KEY.to_owned(),
                secret_key: SECRET_KEY.to_owned(),
            },
            endpoint_config: EndPointPayloadConf::new("gitbar".to_owned(), None, domain, false),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        prepare_s3_bucket(port, bucket).await;

        let (tx, mut rx) = channel(2);
        let original_id = s3_upload_progress_internal(tx.into(), payload, None, true);
        let mut at_least_one_error = false;

        while let Some((id, event)) = rx.recv().await {
            assert_eq!(original_id, id);
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
        let payload = XmlPayload {
            content: std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                .unwrap_or_default()
                .to_owned(),
            connection: S3Connection {
                bucket_name: "not_a_bucket".to_owned(),
                region: REGION.to_owned(),
                endpoint: domain.clone(),
                access_key: ACCESS_KEY.to_owned(),
                secret_key: SECRET_KEY.to_owned(),
            },
            endpoint_config: EndPointPayloadConf::new("gitbar".to_owned(), None, domain, false),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;

        let (tx, mut rx) = channel(2);
        let original_id = s3_xml_upload_progress_internal(tx.into(), payload, true)
            .await
            .unwrap();
        let mut at_least_one_error = false;

        while let Some((id, event)) = rx.recv().await {
            assert_eq!(original_id, id);
            match event {
                Ok(_) => (),
                Err(_) => at_least_one_error = true,
            }
        }

        assert!(at_least_one_error);

        handle.abort();
    }
}
