use serde::{Serialize, Serializer};
use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Error getting the data from endpoint")]
    Network(#[from] reqwest::Error),
    #[error("Error getting data at specified path")]
    Io(#[from] std::io::Error),
    #[error("Error transferring data to the server")]
    Ftp(#[from] suppaftp::FtpError),
    #[error("Error while configuring s3 credentials")]
    S3Credentials(#[from] s3::creds::error::CredentialsError),
    #[error("Error while working on s3 storage")]
    S3Operation(#[from] s3::error::S3Error),
    #[error("Internal tauri error")]
    Tauri(#[from] tauri::Error),
    #[error("Internal tauri error")]
    TauriApi(#[from] tauri::api::Error),
    #[error("Tokio channel closed")]
    TokioSendClosed,
    #[error("Task failed to execute to completion")]
    TokioSet(#[from] tokio::task::JoinError),
    #[error("Error while acquiring local path")]
    LocalPathConversion,
    #[error("Task aborted before completion")]
    Aborted,
    #[error("Error while decoding audio file")]
    Decoder(#[from] kalosm_sound::rodio::decoder::DecoderError),
    #[error("Whisper instantation failed")]
    Whisper,
    #[error("Wuerstchen instantation failed")]
    Wuerstchen,
    #[error("Serde failure")]
    Serde(#[from] serde_json::Error),
}

impl Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

pub type Result<T, E = Error> = anyhow::Result<T, E>;
