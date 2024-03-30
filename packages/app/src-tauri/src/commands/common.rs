use std::{
    ffi::OsStr,
    path::{Path, PathBuf},
};

use derive_new::new;
use getset::Getters;
use kalosm_sound::ModelLoadingProgress;
use serde::{Deserialize, Deserializer, Serialize};
use tauri::AppHandle;
use tauri_plugin_channel::{channel, Channel};
use tokio::{
    sync::mpsc::{Receiver, Sender},
    task::spawn_blocking,
};

use crate::utils::{
    event::{Command, Event, Message},
    file::{get_file_info, get_payload_info, write_to_temp_file, TempFile},
    result::{Error, Result},
};

use crate::utils::event::{CommandReceiver, EventProducer};

#[derive(Deserialize, Getters, new)]
pub struct Uploadable {
    local_path: Option<PathBuf>,

    payload: Option<String>,

    #[serde(skip)]
    #[new(default)]
    temp_file: Option<TempFile>,

    #[serde(flatten)]
    #[getset(get = "pub ")]
    remote_config: RemoteUploadableConf,
}

impl Uploadable {
    fn ext(&self) -> Option<&str> {
        if let Some(path) = &self.local_path {
            // Try to extract file extension from local_path and remote filename
            // In case both local_path and remote filename have a valid ext, remote filename wins
            Self::extract_from_filename(&self.remote_config.file_name)
                .or(path.extension().and_then(OsStr::to_str))
        } else {
            Self::extract_from_filename(&self.remote_config.file_name)
        }
    }

    fn extract_from_filename(filename: &str) -> Option<&str> {
        Path::new(filename).extension().and_then(OsStr::to_str)
    }

    pub fn remote_file_path(&self) -> String {
        let file_name = self.remote_filename();

        match self.remote_config.path() {
            Some(path) => format!("{path}/{file_name}"),
            None => file_name,
        }
    }

    pub fn remote_filename(&self) -> String {
        match Self::extract_from_filename(&self.remote_config.file_name) {
            Some(_) => self.remote_config.file_name().to_owned(),
            None => match self.ext() {
                Some(ext) => format!("{}.{}", self.remote_config.file_name(), ext),
                None => self.remote_config.file_name().to_owned(),
            },
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
            let file = write_to_temp_file(data, &self.remote_filename()).await?;
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
            return get_payload_info(data, self.ext().unwrap_or_default());
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

        let file_path = self.remote_file_path();
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
    #[serde(default, deserialize_with = "empty_string_is_none")]
    path: Option<String>,

    http_host: String,
    https: bool,
}

fn empty_string_is_none<'de, D: Deserializer<'de>>(data: D) -> Result<Option<String>, D::Error> {
    let obj: Option<String> = Option::deserialize(data)?.map(|data: String| data.trim().to_owned());
    Ok(obj.filter(|data| !data.is_empty()))
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

pub fn build_channel(app_handle: AppHandle) -> (EventProducer, CommandReceiver, Channel) {
    let (sender, receiver, channel) = channel(app_handle);
    let producer = EventProducer::new(sender);
    let receiver = CommandReceiver::new(receiver);
    (producer, receiver, channel)
}

pub fn build_local_channel() -> (
    EventProducer,
    CommandReceiver,
    Receiver<Message>,
    Sender<Command>,
) {
    let (tx_event, rx_event) = tokio::sync::mpsc::channel(2);
    let (tx_command, rx_command) = tokio::sync::mpsc::channel(2);
    let producer = EventProducer::new(tx_event);
    let receiver = CommandReceiver::new(rx_command);

    (producer, receiver, rx_event, tx_command)
}

pub fn build_loading_handler(
    producer: &EventProducer,
) -> impl FnMut(ModelLoadingProgress) + Send + Sync + 'static {
    let mut last_progress: u8 = 0;
    let producer_download = producer.clone();

    move |data| {
        if let ModelLoadingProgress::Downloading { source, progress } = data {
            let progress = (progress * 100.).ceil() as u8;
            if last_progress != progress {
                last_progress = progress;
                let mut producer = producer_download.clone();
                spawn_blocking(move || {
                    producer.blocking_send(Ok(Event::DownloadProgress {
                        file: source,
                        progress,
                    }));
                });
            }
        }
    }
}
