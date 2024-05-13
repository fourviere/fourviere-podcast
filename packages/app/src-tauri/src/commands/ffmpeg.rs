use std::path::{Path, PathBuf};

use function_name::named;
use serde::Deserialize;
use serde_aux::field_attributes::deserialize_number_from_string;
use tauri::api::process::{Command, CommandEvent};

use crate::{log_if_error_and_return, utils::result::Result};

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

#[named]
#[tauri::command]
pub async fn get_audio_duration_secs(path: &Path) -> Result<f64> {
    let args = [
        "-v",
        "quiet",
        "-print_format",
        "json",
        "-show_format",
        "-show_streams",
        path.to_str().unwrap_or(""),
    ];
    let json = raw_ffprobe_call(args).await;
    log_if_error_and_return!(&json);
    let outuput = serde_json::from_str::<FFProbeOutput>(&json?);
    log_if_error_and_return!(&outuput);
    Ok(outuput?.format.duration)
}

async fn raw_ffprobe_call<I, S>(args: I) -> Result<String>
where
    I: IntoIterator<Item = S>,
    S: AsRef<str>,
{
    let mut json_data = String::new();
    let sidecar = Command::new_sidecar("ffprobe")?.args(args);
    let (mut rx, _) = sidecar.spawn()?;
    while let Some(event) = rx.recv().await {
        if let CommandEvent::Stdout(line) = event {
            json_data += &line;
        }
    }
    Ok(json_data)
}

#[cfg(test)]
mod test {
    use std::path::PathBuf;

    use crate::{
        commands::ffmpeg::get_audio_duration_secs, test_file,
        utils::test::test_utility::copy_binary_to_deps,
    };

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ffprobe_duration() {
        let _ = copy_binary_to_deps("ffprobe");
        let path = PathBuf::from(test_file!("gitbar_189_110_secs.mp3"));
        let result = get_audio_duration_secs(&path).await;
        assert!(result.is_ok());
        assert_eq!(result.unwrap(), 110.968163)
    }
}
