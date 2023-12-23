use ::function_name::named;
use get_chunk::iterator::FileIter;
use s3::{creds::Credentials, Bucket, Region};
use serde::{Deserialize, Serialize};
use std::{borrow::Cow, path::Path};
use tauri::Window;
use tokio::{fs, spawn, task::JoinSet};
use uuid::Uuid;

use crate::{
    log_if_error_and_return,
    utils::{
        event::{Channel, Event, EventProducer},
        file::get_file_info,
        result::Result,
    },
};

#[derive(Deserialize)]
pub struct Payload {
    local_path: String,
    bucket_name: String,
    region: String,
    endpoint: String,
    access_key: String,
    secret_key: String,
    // Future data
    http_host: String,
    https: bool,
    path: Option<String>,
    file_name: String,
}

#[derive(Debug, PartialEq, Serialize)]
pub struct FileInfo {
    pub url: String,
    pub mime_type: String,
    pub size: u64,
}

#[tauri::command]
pub async fn s3_upload_window_with_progress(window: Window, payload: Payload) -> Uuid {
    s3_upload_with_progress(window.into(), payload, false)
}

#[named]
fn s3_upload_with_progress(channel: Channel, payload: Payload, use_path_style: bool) -> Uuid {
    let mut event_producer = EventProducer::new(channel);
    let id = event_producer.id();

    spawn(async move {
        let result = s3_upload_with_progress_task(&mut event_producer, payload, use_path_style)
            .await
            .map(Event::S3Result);
        log_if_error_and_return!(&result);
        event_producer.send(result).await;
    });
    id
}

async fn s3_upload_with_progress_task(
    event_producer: &mut EventProducer,
    payload: Payload,
    use_path_style: bool,
) -> Result<FileInfo> {
    // Init Phase
    event_producer.send(Ok(Event::Progress(0))).await;

    let credentials = Credentials::new(
        Some(&payload.access_key),
        Some(&payload.secret_key),
        None,
        None,
        None,
    )?;

    let mut bucket = Bucket::new(
        &payload.bucket_name,
        Region::Custom {
            region: payload.region,
            endpoint: payload.endpoint,
        },
        credentials,
    )?;

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

    let path = payload.path.unwrap_or("".to_owned());
    let new_file_name: String = format!("{}/{}.{}", &path, &payload.file_name, &ext);

    //let file = fs::read(&payload.local_path).await?;
    let file_info = get_file_info(&payload.local_path).await?;

    event_producer.send(Ok(Event::DeltaProgress(5))).await;

    // Trasfer phase: 80-88%

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

    let protocol = if payload.https { "https" } else { "http" };

    let file_path = if !path.is_empty() {
        format!("{}/{}.{}", path, payload.file_name, ext)
    } else {
        format!("{}.{}", payload.file_name, ext)
    };

    event_producer.send(Ok(Event::DeltaProgress(5))).await;

    Ok(FileInfo {
        size: file_info.size,
        mime_type: file_info.mime_type,
        url: format!("{}://{}/{}", protocol, payload.http_host, file_path),
    })
}

#[named]
#[tauri::command]
pub async fn s3_upload(payload: Payload) -> Result<FileInfo> {
    let upload_result = s3_upload_internal(payload, false).await;
    log_if_error_and_return!(upload_result)
}

async fn s3_upload_internal(payload: Payload, use_path_style: bool) -> Result<FileInfo> {
    let credentials = Credentials::new(
        Some(&payload.access_key),
        Some(&payload.secret_key),
        None,
        None,
        None,
    )?;

    let mut bucket = Bucket::new(
        &payload.bucket_name,
        Region::Custom {
            region: payload.region,
            endpoint: payload.endpoint,
        },
        credentials,
    )?;

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

    let path = payload.path.unwrap_or("".to_owned());
    let new_file_name = format!("{}/{}.{}", &path, &payload.file_name, &ext);

    bucket
        .put_object_with_content_type(new_file_name, &file, &file_info.mime_type)
        .await?;

    let protocol = if payload.https { "https" } else { "http" };

    let file_path = if !path.is_empty() {
        format!("{}/{}.{}", path, payload.file_name, ext)
    } else {
        format!("{}.{}", payload.file_name, ext)
    };

    Ok(FileInfo {
        size: file_info.size,
        mime_type: file_info.mime_type,
        url: format!("{}://{}/{}", protocol, payload.http_host, file_path),
    })
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
        commands::s3::{s3_upload_internal, s3_upload_with_progress, Payload},
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
        let payload = Payload {
            local_path: test_file!("gitbar.xml").to_owned(),
            bucket_name: bucket.to_owned(),
            region: REGION.to_owned(),
            endpoint: domain.clone(),
            access_key: ACCESS_KEY.to_owned(),
            secret_key: SECRET_KEY.to_owned(),
            http_host: domain,
            https: false,
            path: None,
            file_name: "gitbar".to_owned(),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        prepare_s3_bucket(port, bucket).await;

        let info_result = s3_upload_internal(payload, true).await;
        assert!(info_result.is_ok());
        let file_info = info_result.unwrap();
        assert_eq!(file_info.size, FILESIZE);
        assert_eq!(file_info.mime_type, "text/xml");

        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_s3_upload_err_host() {
        let port = 3122;
        let bucket = "test-err-host";
        let domain = "https://localhost:".to_owned() + port.to_string().as_str();
        let payload = Payload {
            local_path: test_file!("gitbar.xml").to_owned(),
            bucket_name: bucket.to_owned(),
            region: REGION.to_owned(),
            endpoint: domain.clone(),
            access_key: ACCESS_KEY.to_owned(),
            secret_key: SECRET_KEY.to_owned(),
            http_host: domain,
            https: false,
            path: None,
            file_name: "gitbar".to_owned(),
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
    async fn test_s3_upload_err_local_path() {
        let port = 3123;
        let bucket = "test-err-local-path";
        let domain = "http://localhost:".to_owned() + port.to_string().as_str();
        let payload = Payload {
            local_path: test_file!("gitbar.rss").to_owned(),
            bucket_name: bucket.to_owned(),
            region: REGION.to_owned(),
            endpoint: domain.clone(),
            access_key: ACCESS_KEY.to_owned(),
            secret_key: SECRET_KEY.to_owned(),
            http_host: domain,
            https: false,
            path: None,
            file_name: "gitbar".to_owned(),
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
        let payload = Payload {
            local_path: test_file!("gitbar.xml").to_owned(),
            bucket_name: "not_a_bucket".to_owned(),
            region: REGION.to_owned(),
            endpoint: domain.clone(),
            access_key: ACCESS_KEY.to_owned(),
            secret_key: SECRET_KEY.to_owned(),
            http_host: domain,
            https: false,
            path: None,
            file_name: "gitbar".to_owned(),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        assert!(s3_upload_internal(payload, true).await.is_err());
        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_s3_upload_progress_ok() {
        let port = 3125;
        let bucket = "test-ok";
        let domain = "http://localhost:".to_owned() + port.to_string().as_str();
        let payload = Payload {
            local_path: test_file!("gitbar.xml").to_owned(),
            bucket_name: bucket.to_owned(),
            region: REGION.to_owned(),
            endpoint: domain.clone(),
            access_key: ACCESS_KEY.to_owned(),
            secret_key: SECRET_KEY.to_owned(),
            http_host: domain,
            https: false,
            path: None,
            file_name: "gitbar".to_owned(),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        prepare_s3_bucket(port, bucket).await;

        let (tx, mut rx) = channel(2);
        let original_id = s3_upload_with_progress(tx.into(), payload, true);
        let mut at_least_one_progress = false;
        let mut at_least_one_result = false;

        while let Some((id, event)) = rx.recv().await {
            assert_eq!(original_id, id);
            match event {
                Ok(event) => match event {
                    crate::utils::event::Event::Progress(_) => at_least_one_progress = true,
                    crate::utils::event::Event::S3Result(file_info) => {
                        assert_eq!(file_info.size, FILESIZE);
                        assert_eq!(file_info.mime_type, "text/xml");
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
        let payload = Payload {
            local_path: test_file!("gitbar.xml").to_owned(),
            bucket_name: bucket.to_owned(),
            region: REGION.to_owned(),
            endpoint: domain.clone(),
            access_key: ACCESS_KEY.to_owned(),
            secret_key: SECRET_KEY.to_owned(),
            http_host: domain,
            https: false,
            path: None,
            file_name: "gitbar".to_owned(),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        prepare_s3_bucket(port, bucket).await;

        let (tx, mut rx) = channel(2);
        let original_id = s3_upload_with_progress(tx.into(), payload, true);
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
        let payload = Payload {
            local_path: test_file!("gitbar.rss").to_owned(),
            bucket_name: bucket.to_owned(),
            region: REGION.to_owned(),
            endpoint: domain.clone(),
            access_key: ACCESS_KEY.to_owned(),
            secret_key: SECRET_KEY.to_owned(),
            http_host: domain,
            https: false,
            path: None,
            file_name: "gitbar".to_owned(),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        prepare_s3_bucket(port, bucket).await;

        let (tx, mut rx) = channel(2);
        let original_id = s3_upload_with_progress(tx.into(), payload, true);
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
        let payload = Payload {
            local_path: test_file!("gitbar.xml").to_owned(),
            bucket_name: "not_a_bucket".to_owned(),
            region: REGION.to_owned(),
            endpoint: domain.clone(),
            access_key: ACCESS_KEY.to_owned(),
            secret_key: SECRET_KEY.to_owned(),
            http_host: domain,
            https: false,
            path: None,
            file_name: "gitbar".to_owned(),
        };

        let handle = spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;

        let (tx, mut rx) = channel(2);
        let original_id = s3_upload_with_progress(tx.into(), payload, true);
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
