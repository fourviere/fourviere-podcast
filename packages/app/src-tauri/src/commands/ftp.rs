use std::fs::File;
use std::io::BufReader;
use std::path::Path;
use std::str;
use suppaftp::types::FileType;
use suppaftp::{FtpStream, Mode};

#[derive(serde::Deserialize)]
pub struct Payload {
    host: String,
    port: u16,
    user: String,
    password: String,
    local_path: String,
    path: Option<String>,
    file_name: String,
    http_host: String,
    https: bool,
}

#[tauri::command]
pub async fn ftp_upload(payload: Payload) -> Result<String, String> {
    let ftp = FtpStream::connect(format!("{}:{}", payload.host, payload.port).as_str());
    if let Err(_) = ftp {
        return Err("Failed to connect to server".to_string());
    }

    let mut ftp_stream = ftp.unwrap();
    let login = ftp_stream.login(payload.user, payload.password);
    if let Err(_) = login {
        return Err("Failed to login to server: {}".to_string());
    }

    ftp_stream.set_mode(Mode::ExtendedPassive);

    if let Some(path) = &payload.path {
        let change_path = ftp_stream.cwd(path);
        if let Err(_) = change_path {
            return Err("Failed to change directory".to_string());
        }
    }

    if let Err(_) = ftp_stream.transfer_type(FileType::Binary) {
        return Err("Failed setting transfer type".to_string());
    }

    let file = File::open(&payload.local_path);
    if let Err(_) = file {
        return Err("Failed to open file".to_string());
    }

    let path = Path::new(&payload.local_path);
    let ext = match path.extension() {
        Some(ext) => ext.to_string_lossy().to_string(),
        None => "".to_string(),
    };

    let mut reader = BufReader::new(file.unwrap());
    let res = ftp_stream.put_file(format!("{}.{}", &payload.file_name, &ext), &mut reader);
    if let Err(_) = res {
        return Err("Failed to upload file".to_string());
    }

    let res = ftp_stream.quit();
    if let Err(_) = res {
        return Err("Failed to quit".to_string());
    }

    let protocol = if payload.https { "https" } else { "http" };

    Ok(format!(
        "{}://{}/{}/{}.{}",
        protocol,
        payload.http_host,
        payload.path.unwrap_or("".to_string()),
        payload.file_name,
        ext
    ))
}
