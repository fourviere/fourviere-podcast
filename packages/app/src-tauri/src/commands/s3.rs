use ::function_name::named;
use log::error;
use mime_guess::from_path;
use s3::{creds::Credentials, Bucket, Region};
use std::{borrow::Cow, path::Path};
use tokio::fs;

use crate::{log_if_error, utils::result::Result};

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
    let upload_result = s3_upload_internal(payload).await;
    log_if_error!(upload_result)
}

async fn s3_upload_internal(payload: Payload) -> Result<String> {
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

    let file = fs::read(&payload.local_path).await?;

    // Guess the MIME type based on the file extension
    let mime = from_path(&payload.local_path).first_or_octet_stream();
    let ext = Path::new(&payload.local_path)
        .extension()
        .map_or(Cow::default(), |ext| ext.to_string_lossy());

    let path = payload.path.unwrap_or("".to_string());
    let new_file_name = format!("{}/{}.{}", &path, &payload.file_name, &ext);

    bucket
        .put_object_with_content_type(new_file_name, &file, mime.as_ref())
        .await?;

    let protocol = if payload.https { "https" } else { "http" };
    Ok(format!(
        "{}://{}/{}/{}.{}",
        protocol, payload.http_host, path, payload.file_name, ext
    ))
}
