use ::function_name::named;
use log::{debug, error};
use tokio::fs::read_to_string;

use crate::utils::result::Result;

#[named]
#[tauri::command]
pub async fn read_text_file(path: &str) -> Result<String> {
    let read_result = read_text_file_internal(path).await;
    debug!("{} result {:?}", function_name!(), read_result);
    if let Err(err) = &read_result {
        error!("{} function failed: {:?}", function_name!(), err);
    }
    read_result
}

async fn read_text_file_internal(path: &str) -> Result<String> {
    read_to_string(path).await.map_err(|err| err.into())
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
