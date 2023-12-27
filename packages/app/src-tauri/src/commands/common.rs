use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct EndPointPayloadConf {
    pub file_name: String,
    pub path: Option<String>,
    pub http_host: String,
    pub https: bool,
}

#[derive(Debug, PartialEq, Serialize)]
pub struct FileInfo {
    pub url: String,
    pub mime_type: String,
    pub size: u64,
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
