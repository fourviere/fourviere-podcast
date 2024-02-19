use std::path::PathBuf;

use cached::proc_macro::cached;
use derive_new::new;
use getset::Getters;
use serde::{Deserialize, Serialize};
use tokio_util::sync::CancellationToken;
use uuid::Uuid;

use crate::utils::{
    file::{get_file_info, get_payload_info, write_to_temp_file, TempFile},
    result::{Error, Result},
};

#[tauri::command]
pub async fn abort_progress_task(uuid: Uuid) -> Result<()> {
    get_cancellation_token(uuid).cancel();
    println!("Aborted task {}", uuid);
    Ok(())
}

#[cached(sync_writes = true)]
pub fn get_cancellation_token(_uuid: Uuid) -> CancellationToken {
    CancellationToken::new()
}

#[derive(Deserialize, Getters, new)]
pub struct Uploadable {
    #[serde(default)]
    local_path: Option<PathBuf>,

    #[serde(default)]
    payload: Option<Vec<u8>>,

    #[serde(skip)]
    #[new(default)]
    temp_file: Option<TempFile>,

    #[serde(flatten)]
    #[getset(get = "pub ")]
    remote_config: RemoteUploadableConf,
}

impl Uploadable {
    fn ext(&self) -> Option<String> {
        //TODO implement ext ovverride logic
        Some("".to_string())
    }

    pub fn remote_file_name(&self) -> String {
        let file_name = match self.ext() {
            Some(ext) => format!("{}.{}", self.remote_config.file_name(), ext),
            None => self.remote_config.file_name().to_owned(),
        };

        match self.remote_config.path() {
            Some(path) => format!("{path}/{file_name}"),
            None => file_name,
        }
    }

    pub async fn local_path(&mut self) -> Result<PathBuf> {
        if let Some(path) = &self.local_path {
            return Ok(path.clone());
        }

        if let Some(file) = &self.temp_file {
            return Ok(file.path().into());
        }

        if let Some(data) = &self.payload {
            let file = write_to_temp_file(data, &self.remote_file_name()).await?;
            let path = Ok(file.path().into());
            self.temp_file = Some(file);
            return path;
        }

        Err(Error::Aborted)
    }

    pub fn local_file_info(&self) -> Result<crate::utils::file::FileInfo> {
        if let Some(path) = &self.local_path {
            return get_file_info(path);
        }

        if let Some(data) = &self.payload {
            return get_payload_info(data, &self.ext().unwrap_or_default());
        }

        Err(Error::Aborted)
    }

    pub fn remote_file_info(&self) -> Result<RemoteFileInfo> {
        let local = self.local_file_info()?;

        let protocol = if self.remote_config.https {
            "https"
        } else {
            "http"
        };

        let file_path = match self
            .remote_config
            .path
            .as_ref()
            .filter(|path| !path.is_empty())
        {
            Some(path) => format!("{}/{}", path, self.remote_config.file_name,),
            None => format!("{}.{}", self.remote_config.file_name, "exxt"),
        };

        Ok(RemoteFileInfo {
            url: format!(
                "{}://{}/{}",
                protocol, self.remote_config.http_host, file_path
            ),
            mime_type: local.mime_type,
            size: local.size,
        })
    }
}

#[derive(Deserialize, Getters, new)]
pub struct RemoteUploadableConf {
    #[getset(get = "pub ")]
    file_name: String,

    #[getset(get = "pub ")]
    path: Option<String>,

    http_host: String,
    https: bool,
}

#[derive(Debug, Getters, PartialEq, Serialize)]
pub struct RemoteFileInfo {
    #[getset(get = "pub ")]
    url: String,

    #[getset(get = "pub ")]
    mime_type: String,

    #[getset(get = "pub ")]
    size: u64,
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
