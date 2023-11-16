use reqwest;

#[tauri::command]
pub async fn fetch_feed(url: &str) -> Result<String, String> {
    reqwest::get(url)
        .await
        .map_err(|_| "Error getting the data from remote endpoint".to_string())?
        .text()
        .await
        .map_err(|_| "Error getting the data from remote endpoint".to_string())
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
