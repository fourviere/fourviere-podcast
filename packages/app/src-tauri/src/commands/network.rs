use ::function_name::named;
use log::error;

use crate::{log_if_error, utils::result::Result};

#[named]
#[tauri::command]
pub async fn fetch_feed(url: &str) -> Result<String> {
    let fetch_result = fetch_feed_internal(url).await;
    log_if_error!(fetch_result)
}

async fn fetch_feed_internal(url: &str) -> Result<String> {
    reqwest::get(url)
        .await?
        .text()
        .await
        .map_err(|err| err.into())
}

#[cfg(test)]
mod test {
    use rss::Channel;

    use crate::commands::network::fetch_feed;

    #[tokio::test]
    async fn test_fetch_feed_ok() {
        let feed = fetch_feed("https://www.spreaker.com/show/4173756/episodes/feed").await;
        assert!(feed.is_ok());
        let channel = Channel::read_from(feed.unwrap().as_bytes());
        assert!(channel.is_ok());

        assert_eq!(channel.unwrap().title, "Gitbar - Italian developer podcast")
    }

    #[tokio::test]
    async fn test_fetch_feed_err() {
        let feed = fetch_feed("https://www.spreaker.it/show/4173756/episodes/feed").await;
        assert!(feed.is_err());
    }
}
