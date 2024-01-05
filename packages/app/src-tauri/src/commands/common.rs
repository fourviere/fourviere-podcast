use cached::proc_macro::cached;
use derive_new::new;
use getset::Getters;
use serde::{Deserialize, Serialize};
use tokio_util::sync::CancellationToken;
use uuid::Uuid;

use crate::utils::result::Result;

#[tauri::command]
pub async fn abort_progress_task(uuid: Uuid) -> Result<()> {
    get_cancellation_token(uuid).cancel();
    Ok(())
}

#[cached(sync_writes = true)]
pub fn get_cancellation_token(_uuid: Uuid) -> CancellationToken {
    CancellationToken::new()
}

#[derive(Deserialize, Getters, new)]
pub struct EndPointPayloadConf {
    #[getset(get = "pub ")]
    file_name: String,

    #[getset(get = "pub ")]
    path: Option<String>,

    http_host: String,
    https: bool,
}

#[derive(Debug, Getters, PartialEq, Serialize)]
pub struct FileInfo {
    #[getset(get = "pub ")]
    url: String,

    #[getset(get = "pub ")]
    mime_type: String,

    #[getset(get = "pub ")]
    size: u64,
}

impl FileInfo {
    pub fn new(
        endpoint_config: &EndPointPayloadConf,
        file_info: &crate::utils::file::FileInfo,
        ext: &str,
    ) -> Self {
        let protocol = if endpoint_config.https {
            "https"
        } else {
            "http"
        };

        let file_path = match endpoint_config
            .path
            .as_ref()
            .filter(|path| !path.is_empty())
        {
            Some(path) => format!("{}/{}.{}", path, endpoint_config.file_name, ext),
            None => format!("{}.{}", endpoint_config.file_name, ext),
        };

        FileInfo {
            size: file_info.size,
            mime_type: file_info.mime_type.clone(),
            url: format!("{}://{}/{}", protocol, endpoint_config.http_host, file_path),
        }
    }
}

#[cfg(test)]
mod test {
    use std::time::Duration;

    use tokio::{spawn, sync::mpsc::channel, time::sleep};

    use crate::{
        commands::common::{abort_progress_task, get_cancellation_token},
        utils::{event::EventProducer, result::Error},
    };

    #[tokio::test(flavor = "multi_thread")]
    async fn test_abort_ok() {
        let (tx, mut rx) = channel(2);
        let mut event_producer = EventProducer::new(tx.into());
        let original_id = event_producer.id();

        spawn(async move {
            let token = get_cancellation_token(event_producer.id());
            sleep(Duration::from_secs(3)).await;
            token.cancelled().await;
            event_producer.send(Err(Error::Aborted)).await
        });

        assert!(abort_progress_task(original_id).await.is_ok());

        match rx.recv().await {
            Some((id, message)) => {
                assert_eq!(original_id, id);
                match message {
                    Ok(_) => panic!("Return type must be Error::Aborted. Found {message:?}"),
                    Err(Error::Aborted) => {}
                    Err(_) => panic!("Return type must be Error::Aborted. Found {message:?}"),
                }
            }
            None => panic!("Tx closed"),
        }
    }
}
