use crate::utils::result::Result;
use mime_guess::from_path;
use serde::Serialize;

#[derive(Serialize)]
pub struct FileInfo {
    pub mime_type: String,
    pub size: u64,
}

pub async fn get_file_info(path: &String) -> Result<FileInfo> {
    let mime_type = from_path(path).first_or_octet_stream().to_string();
    let size = tokio::fs::metadata(path).await?.len();
    Ok(FileInfo { mime_type, size })
}
