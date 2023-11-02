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
