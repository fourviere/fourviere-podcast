use std::{
    fs::File,
    io::BufReader,
    path::{Path, PathBuf},
};

use function_name::named;
use kalosm_sound::{rodio::Decoder, Whisper, WhisperLanguage, WhisperSource};
use serde::{Deserialize, Deserializer};
use tauri::AppHandle;
use tauri_plugin_channel::Channel;
use tokio::{select, spawn, sync::mpsc};
use tokio_util::sync::CancellationToken;

use crate::{
    commands::common::build_channel,
    log_if_error_and_return,
    utils::{
        event::{CommandReceiver, Event, EventProducer},
        result::{Error, Result},
        whisper::{whisper_lang, whisper_model},
    },
};

use super::{common::build_loading_handler, ffmpeg::get_audio_duration_secs};

#[derive(Deserialize)]
pub struct WhisperConf {
    audio_path: PathBuf,

    #[serde(deserialize_with = "string_to_whisper_lang")]
    language: Option<WhisperLanguage>,

    #[serde(deserialize_with = "string_to_whisper_model")]
    model: WhisperSource,
}

fn string_to_whisper_lang<'de, D: Deserializer<'de>>(
    data: D,
) -> core::result::Result<Option<WhisperLanguage>, D::Error> {
    let obj: Option<WhisperLanguage> = Option::deserialize(data)?
        .map(|data: String| data.trim().to_owned())
        .map(|cc| whisper_lang(&cc));
    Ok(obj)
}

fn string_to_whisper_model<'de, D: Deserializer<'de>>(
    data: D,
) -> core::result::Result<WhisperSource, D::Error> {
    let data = String::deserialize(data)?;
    Ok(whisper_model(&data))
}

#[named]
#[tauri::command]
pub async fn whisper_transcriber(app_handle: AppHandle, conf: WhisperConf) -> Result<Channel> {
    let (producer, receiver, channel) = build_channel(app_handle);
    let transcribe = whisper_transcriber_internal(conf, producer, receiver).await;
    log_if_error_and_return!(transcribe)?;
    Ok(channel)
}

async fn whisper_transcriber_internal(
    conf: WhisperConf,
    mut producer: EventProducer,
    receiver: CommandReceiver,
) -> Result<()> {
    let audio = load_audio(&conf.audio_path)?;
    let audio_duration_secs = get_audio_duration_secs(&conf.audio_path).await?;
    let (tx, mut rx) = mpsc::unbounded_channel();
    receiver.started().await;

    let whisper = Whisper::builder()
        .with_language(conf.language)
        .with_source(conf.model)
        .build_with_loading_handler(build_loading_handler(&producer))
        .await
        .map_err(|_| Error::Whisper)?;

    spawn(async move {
        receiver.started().await;
        producer.send(Ok(Event::Progress(0))).await;
        let canc_token: CancellationToken = receiver.into();

        if let Err(err) = whisper
            .transcribe_into(audio, tx)
            .map_err(|_| Error::Whisper)
        {
            producer.send(Err(err)).await;
            canc_token.cancel();
        }

        loop {
            select! {
                _ = canc_token.cancelled() => {
                    producer.send(Err(Error::Aborted)).await;
                    break
                }
                res = rx.recv() => {
                    match res {
                        Some(transcribed) => {
                            let text = transcribed.text().to_owned();
                            let probability_of_no_speech = transcribed.probability_of_no_speech();
                            let offset = transcribed.start();
                            let mut duration = transcribed.duration();

                            //transcribed.duration() seems to be fixed at 30.
                            //This can brake progress count when the last segment real duration <30
                            if offset + duration > audio_duration_secs {
                                duration = audio_duration_secs - offset;
                            }

                            producer.send(Ok(Event::TranscriptionSegment{text, probability_of_no_speech, offset, duration})).await;

                            if audio_duration_secs >= 0.1 && audio_duration_secs.ceil() > duration.ceil() {
                                let progress = (duration * 100. / audio_duration_secs).floor() as u8;
                                producer.send(Ok(Event::DeltaProgress(progress))).await;
                            }
                        },
                        None => {
                            producer.send(Ok(Event::Progress(100))).await;
                            break;
                        }
                    }
                }
            }
        }
    });
    Ok(())
}

fn load_audio(path: &Path) -> Result<Decoder<BufReader<File>>> {
    let file = BufReader::new(File::open(path)?);
    Decoder::new(file).map_err(Into::into)
}

#[cfg(test)]
mod test {
    use std::{path::PathBuf, time::Duration};

    use tauri::async_runtime::spawn;
    use tokio::time::sleep;

    use crate::{
        commands::common::build_local_channel,
        test_file,
        utils::{
            event::{Command, Event},
            test::test_utility::copy_binary_to_deps,
        },
    };

    use super::{whisper_transcriber_internal, WhisperConf};

    #[ignore]
    #[tokio::test(flavor = "multi_thread")]
    async fn simple_transcription_test() {
        let conf = WhisperConf {
            audio_path: PathBuf::from(test_file!("gitbar_189_110_secs.mp3")),
            language: Some(kalosm_sound::WhisperLanguage::Italian),
            model: kalosm_sound::WhisperSource::Tiny,
        };

        copy_binary_to_deps("ffprobe").unwrap();

        let (producer, receiver, mut rx_event, tx_command) = build_local_channel();
        let _ = tx_command.send(Command::Start).await;
        spawn(async move {
            assert!(whisper_transcriber_internal(conf, producer, receiver)
                .await
                .is_ok());
        });
        sleep(Duration::from_secs(2)).await;
        let _ = tx_command.send(Command::Start).await;
        let mut test_transcription = false;
        let mut test_100 = false;
        while let Some(transcribed) = rx_event.recv().await {
            match transcribed {
                Ok(event) => match event {
                    Event::DownloadProgress { file, progress } => {
                        println!("Downloading {file}: {progress}%");
                    }
                    Event::TranscriptionSegment { text, .. } => {
                        test_transcription = true;
                        println!("{text}");
                    }
                    Event::Progress(100) => test_100 = true,
                    _ => (),
                },
                Err(_) => test_100 = false,
            }
        }
        assert!(test_100);
        assert!(test_transcription)
    }
}
