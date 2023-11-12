use std::io::prelude::*;
use std::{fs::File, path::Path};

#[tauri::command]
pub async fn read_file(path: &str) -> Result<String, String> {
    let path = Path::new(path);

    let file = File::open(path);

    if let Err(err) = file {
        return Err(err.to_string());
    }

    let mut buf = Vec::new();
    let read = file.unwrap().read_to_end(&mut buf);

    if let Err(err) = read {
        return Err(err.to_string());
    }

    let utf = String::from_utf8(buf);

    if let Err(err) = utf {
        return Err(err.to_string());
    }

    Ok(utf.unwrap())
}

#[cfg(test)]
mod test {
    use rss::Channel;

    use crate::{commands::fs::read_file, test_file};

    #[tokio::test]
    async fn test_read_file_ok() {
        let feed = read_file(test_file!("gitbar.xml")).await;
        assert!(feed.is_ok());
        let channel = Channel::read_from(feed.unwrap().as_bytes());
        assert!(channel.is_ok());

        assert_eq!(channel.unwrap().title, "Gitbar - Italian developer podcast")
    }

    #[tokio::test]
    async fn test_read_file_error() {
        let feed = read_file(test_file!("gitbar.rss")).await;
        assert!(feed.is_err());
    }
}
