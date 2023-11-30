use ::function_name::named;
use mime_guess::from_path;
use s3::{creds::Credentials, Bucket, Region};
use std::{borrow::Cow, path::Path};
use tokio::fs;

use crate::{log_if_error_and_return, utils::result::Result};

#[derive(serde::Deserialize)]
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

#[named]
#[tauri::command]
pub async fn s3_upload(payload: Payload) -> Result<String> {
    let upload_result = s3_upload_internal(payload, false).await;
    log_if_error_and_return!(upload_result)
}

async fn s3_upload_internal(payload: Payload, use_path_style: bool) -> Result<String> {
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

    // Guess the MIME type based on the file extension
    let mime = from_path(&payload.local_path).first_or_octet_stream();
    let ext = Path::new(&payload.local_path)
        .extension()
        .map_or(Cow::default(), |ext| ext.to_string_lossy());

    let path = payload.path.unwrap_or("".to_owned());
    let new_file_name = format!("{}/{}.{}", &path, &payload.file_name, &ext);

    bucket
        .put_object_with_content_type(new_file_name, &file, mime.as_ref())
        .await?;

    let protocol = if payload.https { "https" } else { "http" };

    let file_path = if !path.is_empty() {
        format!("{}/{}.{}", path, payload.file_name, ext)
    } else {
        format!("{}.{}", payload.file_name, ext)
    };

    Ok(format!(
        "{}://{}/{}",
        protocol, payload.http_host, file_path
    ))
}

#[cfg(test)]
mod test {
    use std::{env::temp_dir, net::TcpListener, time::Duration};

    use hyper::Server;
    use s3::{creds::Credentials, Bucket, BucketConfiguration, Region};
    use s3s::{auth::SimpleAuth, service::S3ServiceBuilder};
    use s3s_fs::FileSystem;
    use tokio::time::sleep;

    use crate::{
        commands::s3::{s3_upload_internal, Payload},
        test_file,
    };

    const ACCESS_KEY: &str = "StealThisUselessAccessKey";
    const SECRET_KEY: &str = "StealThisUselessSecretKey";
    const REGION: &str = "wonderland";

    async fn s3_server(port: u16) {
        let fs = FileSystem::new(temp_dir()).unwrap();

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

        let handle = tokio::spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        prepare_s3_bucket(port, bucket).await;
        assert!(s3_upload_internal(payload, true).await.is_ok());
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

        let handle = tokio::spawn(async move {
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

        let handle = tokio::spawn(async move {
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

        let handle = tokio::spawn(async move {
            s3_server(port).await;
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        assert!(s3_upload_internal(payload, true).await.is_err());
        handle.abort();
    }
}
