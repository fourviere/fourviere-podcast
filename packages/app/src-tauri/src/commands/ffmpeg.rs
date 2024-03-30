use std::path::{Path, PathBuf};

use function_name::named;
use serde::Deserialize;
use serde_aux::field_attributes::deserialize_number_from_string;
use tauri::api::process::{Command, CommandEvent};

use crate::{log_if_error_and_return, utils::result::Result};

#[named]
#[tauri::command]
pub async fn get_audio_duration_secs(path: &Path) -> Result<f64> {
    let json = raw_ffprobe_call(path).await;
    log_if_error_and_return!(&json);
    let outuput = serde_json::from_str::<FFProbeOutput>(&json?);
    log_if_error_and_return!(&outuput);
    Ok(outuput?.format.duration)
}

async fn raw_ffprobe_call(path: &Path) -> Result<String> {
    let mut json_data = String::new();
    let sidecar = Command::new_sidecar("ffprobe")?.args([
        "-v",
        "quiet",
        "-print_format",
        "json",
        "-show_format",
        "-show_streams",
        path.to_str().unwrap_or(""),
    ]);
    let (mut rx, _) = sidecar.spawn()?;
    while let Some(event) = rx.recv().await {
        if let CommandEvent::Stdout(line) = event {
            json_data += &line;
        }
    }
    Ok(json_data)
}

/* Structure is intentionally incomplete.
   Fields will be added whenever necessary
*/
#[derive(Deserialize)]
struct FFProbeOutput {
    format: Format,
}

#[allow(dead_code)]
#[derive(Deserialize)]
struct Format {
    filename: PathBuf,
    nb_streams: u8,
    nb_programs: u8,
    format_name: String,
    format_long_name: String,
    #[serde(deserialize_with = "deserialize_number_from_string")]
    start_time: f64,
    #[serde(deserialize_with = "deserialize_number_from_string")]
    duration: f64,
    #[serde(deserialize_with = "deserialize_number_from_string")]
    size: usize,
    #[serde(deserialize_with = "deserialize_number_from_string")]
    bit_rate: usize,
    probe_score: u8,
}
