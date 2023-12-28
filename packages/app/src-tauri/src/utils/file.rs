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

#[cfg(test)]
mod test {

    use crate::{
        test_file,
        utils::file::{get_file_info, write_string_to_temp_file},
    };

    #[cfg(target_os = "windows")]
    const FILESIZE: u64 = 9156;

    #[cfg(target_os = "linux")]
    const FILESIZE: u64 = 9063;

    #[cfg(target_os = "macos")]
    const FILESIZE: u64 = 9063;

    #[tokio::test]
    async fn test_file_info_ok() {
        let file_info = get_file_info(test_file!("gitbar.xml")).await.unwrap();

        assert_eq!(file_info.size, FILESIZE);

        assert_eq!(file_info.mime_type, "text/xml");
    }

    #[tokio::test]
    async fn test_write_temp_ok() {
        let data =
            std::str::from_utf8(include_bytes!(test_file!("gitbar.xml"))).unwrap_or_default();
        let tmp_file = write_string_to_temp_file(data, "xml").await.unwrap();

        let size = tokio::fs::metadata(tmp_file.path()).await.unwrap().len();
        assert_eq!(size, FILESIZE);

        let path = tmp_file.path().clone();
        drop(tmp_file);
        assert!(tokio::fs::metadata(path).await.is_err());
    }
}
