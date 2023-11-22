use std::{borrow::Cow, path::Path};

use mime_guess::from_path;
use s3::{creds::Credentials, Bucket, Region};
use tokio::fs;

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

#[tauri::command]
pub async fn s3_upload(payload: Payload) -> Result<String, String> {
    let credentials = Credentials::new(
        Some(&payload.access_key),
        Some(&payload.secret_key),
        None,
        None,
        None,
    )
    .map_err(|e| format!("Error creating credentials {}", e))?;

    let mut bucket = Bucket::new(
        &payload.bucket_name,
        Region::Custom {
            region: payload.region,
            endpoint: payload.endpoint,
        },
        credentials,
    )
    .map_err(|e| format!("Error defininf bucket connection {}", e))?;

    // this header is required to make the uploaded file public readable.
    bucket.add_header("x-amz-acl", "public-read");

    let file = fs::read(&payload.local_path)
        .await
        .map_err(|e| format!("Error opening file {}", e))?;

    // Guess the MIME type based on the file extension
    let mime = from_path(&payload.local_path).first_or_octet_stream();
    let ext = Path::new(&payload.local_path)
        .extension()
        .map_or(Cow::default(), |ext| ext.to_string_lossy());

    let path = &payload.path.unwrap_or("".to_string());
    let new_file_name = format!("{}/{}.{}", &path, &payload.file_name, &ext);

    bucket
        .put_object_with_content_type(new_file_name, &file, mime.as_ref())
        .await
        .map_err(|e| format!("Error writing file {}", e))?;

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
