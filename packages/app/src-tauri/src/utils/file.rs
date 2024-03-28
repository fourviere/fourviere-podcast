use std::{
    fs::{self, create_dir},
    path::{Path, PathBuf},
};

use crate::utils::result::{Error, Result};
use getset::Getters;
use mime_guess::{from_ext, from_path};
use serde::Serialize;
use tauri::api::path::data_dir;
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

pub fn get_payload_info(data: &str, ext: &str) -> Result<FileInfo> {
    let mime_type = from_ext(ext).first_or_octet_stream().to_string();
    let size = data.len().try_into().unwrap_or_default();
    Ok(FileInfo { mime_type, size })
}

pub fn get_file_info<P: AsRef<Path>>(path: P) -> Result<FileInfo> {
    let mime_type = from_path(&path).first_or_octet_stream().to_string();
    let size = fs::metadata(path)?.len();
    Ok(FileInfo { mime_type, size })
}

pub async fn write_to_temp_file(data: impl AsRef<[u8]>, filename: &str) -> Result<TempFile> {
    let tmp_dir = tempdir()?;
    let file_path = tmp_dir.path().join(filename);
    let path_string = file_path.to_string_lossy().into_owned();

    tokio::fs::write(file_path, data).await?;
    Ok(TempFile {
        _tmp_dir: tmp_dir,
        path: path_string,
    })
}

pub async fn write_to_file(data: impl AsRef<[u8]>, path: &str) -> Result<String> {
    tokio::fs::write(&path, data).await?;
    Ok(path.to_owned())
}

pub fn create_app_folder(folder: &str) -> Result<PathBuf> {
    let mut path = data_dir().ok_or(Error::LocalPathConversion)?;
    path.push(folder);

    if !path.exists() {
        create_dir(path.as_path())?
    }
    Ok(path)
}

#[cfg(test)]
mod test {

    use crate::{
        test_file,
        utils::file::{get_file_info, write_to_temp_file},
    };

    #[cfg(target_os = "windows")]
    const FILESIZE: u64 = 9156;

    #[cfg(target_os = "linux")]
    const FILESIZE: u64 = 9063;

    #[cfg(target_os = "macos")]
    const FILESIZE: u64 = 9063;

    #[tokio::test]
    async fn test_file_info_ok() {
        let file_info = get_file_info(test_file!("gitbar.xml")).unwrap();

        assert_eq!(file_info.size, FILESIZE);

        assert_eq!(file_info.mime_type, "text/xml");
    }

    #[tokio::test]
    async fn test_write_temp_ok() {
        let data =
            std::str::from_utf8(include_bytes!(test_file!("gitbar.xml"))).unwrap_or_default();
        let tmp_file = write_to_temp_file(data, "xml").await.unwrap();

        let size = tokio::fs::metadata(tmp_file.path()).await.unwrap().len();
        assert_eq!(size, FILESIZE);

        let path = tmp_file.path().clone();
        drop(tmp_file);
        assert!(tokio::fs::metadata(path).await.is_err());
    }
}
