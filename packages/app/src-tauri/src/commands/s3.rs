use mime_guess::from_path;
use s3::{creds::Credentials, Bucket, Region};
use std::fs::File;
use std::io::prelude::*;
use std::path::Path;

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
    print!("Uploading to S3");
    let credentials = Credentials::new(
        Some(&payload.access_key),
        Some(&payload.secret_key),
        None,
        None,
        None,
    );

    if let Err(e) = credentials {
        return Err(format!("Error creating credentials {}", e.to_string()));
    }

    let bucket = Bucket::new(
        &payload.bucket_name,
        Region::Custom {
            region: payload.region,
            endpoint: payload.endpoint,
        },
        credentials.unwrap(),
    );

    if let Err(e) = bucket {
        return Err(format!(
            "Error defininf bucket connection {}",
            e.to_string()
        ));
    }

    let mut bucket = bucket.unwrap();

    // this header is required to make the uploaded file public readable.
    bucket.add_header("x-amz-acl", "public-read");

    let file = File::open(&payload.local_path);
    if let Err(e) = file {
        return Err(format!("Error opening file {}", e.to_string()));
    }

    let mut file = file.unwrap();
    let mut buffer = Vec::new();
    let _ = file.read_to_end(&mut buffer);

    // Guess the MIME type based on the file extension
    let mime = from_path(&payload.local_path).first_or_octet_stream();
    let path = Path::new(&payload.local_path);
    let ext = match path.extension() {
        Some(ext) => ext.to_string_lossy().to_string(),
        None => ("").to_string(),
    };

    let path = payload.path.unwrap_or("".to_string());
    let new_file_name = format!("{}/{}.{}", &path, &payload.file_name, &ext);

    let writing_operation = bucket
        .put_object_with_content_type(new_file_name, &buffer, mime.as_ref())
        .await;

    if let Err(e) = writing_operation {
        return Err(format!("Error writing file {}", e.to_string()));
    }

    let protocol = if payload.https { "https" } else { "http" };
    Ok(format!(
        "{}://{}/{}/{}.{}",
        protocol, payload.http_host, path, payload.file_name, ext
    ))
}
