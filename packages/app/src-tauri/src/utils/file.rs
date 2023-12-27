use crate::utils::result::Result;
use getset::Getters;
use mime_guess::from_path;
use serde::Serialize;
use tempfile::{tempdir, TempDir};

#[derive(Serialize)]
pub struct FileInfo {
    pub mime_type: String,
    pub size: u64,
}

#[derive(Getters)]
pub struct TempFile {
    _tmp_dir: TempDir,

    #[getset(get = "pub ")]
    path: String,
}

pub async fn get_file_info(path: &str) -> Result<FileInfo> {
    let mime_type = from_path(path).first_or_octet_stream().to_string();
    let size = tokio::fs::metadata(path).await?.len();
    Ok(FileInfo { mime_type, size })
}

pub async fn write_string_to_temp_file(data: &str, ext: &str) -> Result<TempFile> {
    let tmp_dir = tempdir()?;
    let file_path = tmp_dir.path().join(format!("temp.{ext}"));
    let path_string = file_path.to_string_lossy().into_owned();

    tokio::fs::write(file_path, data).await?;
    Ok(TempFile {
        _tmp_dir: tmp_dir,
        path: path_string,
    })
}
