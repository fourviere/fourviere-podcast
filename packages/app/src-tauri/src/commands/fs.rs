use ::function_name::named;
use reqwest::header;
use tokio::fs::read_to_string;

use crate::{log_if_error_and_return, utils::result::Result};

#[named]
#[tauri::command]
pub async fn read_text_file(path: &str) -> Result<String> {
    let read_result = read_text_file_internal(path).await;
    log_if_error_and_return!(read_result)
}

async fn read_text_file_internal(path: &str) -> Result<String> {
    read_to_string(path).await.map_err(|err| err.into())
}

#[derive(serde::Serialize)]
pub struct FileInfo {
    content_type: String,
    content_length: String,
}

#[named]
#[tauri::command]
pub async fn read_file_info(url: &str) -> Result<FileInfo> {
    let read_result: std::prelude::v1::Result<FileInfo, crate::utils::result::Error> =
        read_file_info_internal(url).await;
    log_if_error_and_return!(read_result)
}

pub async fn read_file_info_internal(url: &str) -> Result<FileInfo> {
    let client = reqwest::Client::new();

    let resp = client
        .head(url)
        .send()
        .await?
        .error_for_status()
        .and_then(|resp| {
            let content_type = resp
                .headers()
                .get(header::CONTENT_TYPE)
                .map(|header| header.to_str().unwrap_or_default().to_string())
                .unwrap_or_default();
            let content_length = resp
                .headers()
                .get(header::CONTENT_LENGTH)
                .map(|header| header.to_str().unwrap_or_default().to_string())
                .unwrap_or_default();

            let status = resp.status();

            Ok(FileInfo {
                content_type,
                content_length,
            })
        });

    resp.map_err(|err| err.into())
}

#[cfg(test)]
mod test {
    use rss::Channel;

    use crate::{commands::fs::read_file_info, commands::fs::read_text_file, test_file};

    #[tokio::test]
    async fn test_read_text_file_ok() {
        let feed = read_text_file(test_file!("gitbar.xml")).await;
        assert!(feed.is_ok());
        let channel = Channel::read_from(feed.unwrap().as_bytes());
        assert!(channel.is_ok());

        assert_eq!(channel.unwrap().title, "Gitbar - Italian developer podcast")
    }

    #[tokio::test]
    async fn test_read_text_file_error() {
        let feed = read_text_file(test_file!("gitbar.rss")).await;
        assert!(feed.is_err());
    }

    #[tokio::test]
    async fn read_file_info_ok() {
        let data = read_file_info("https://api.spreaker.com/download/episode/57683371/ep178_diversity_ios_anna_chiara_beltrami.mp3").await.unwrap();
        assert_eq!(data.content_length, "78266580");
        assert_eq!(data.content_type, "audio/mpeg");
    }
}
