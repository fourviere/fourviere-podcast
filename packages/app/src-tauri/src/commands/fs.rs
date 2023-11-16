use tokio::fs::read_to_string;

#[tauri::command]
pub async fn read_text_file(path: &str) -> Result<String, String> {
    read_to_string(path).await.map_err(|err| err.to_string())
}

#[cfg(test)]
mod test {
    use rss::Channel;

    use crate::{commands::fs::read_text_file, test_file};

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
}
