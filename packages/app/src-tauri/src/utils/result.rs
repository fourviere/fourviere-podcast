use thiserror::Error;

#[derive(Debug, Error)]
pub enum Error {
    #[error("Error getting the data from endpoint")]
    Network(#[from] reqwest::Error),
    #[error("Error getting data at specified path")]
    Io(#[from] std::io::Error),
    #[error("Error trasfering data to the server")]
    Ftp(#[from] suppaftp::FtpError),
    #[error("Error while configuring s3 credentials")]
    S3Credentials(#[from] s3::creds::error::CredentialsError),
    #[error("Error while operationing on s3 storage")]
    S3Operation(#[from] s3::error::S3Error),
    #[error("Internal tauri error")]
    Tauri(#[from] tauri::Error),
    #[error("Channel Closed")]
    TokioSend,
}

impl serde::Serialize for Error {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

pub type Result<T, E = Error> = anyhow::Result<T, E>;
