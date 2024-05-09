use std::{
    fs::File,
    io::BufReader,
    path::{Path, PathBuf},
};

use kalosm_sound::{rodio::Decoder, Whisper, WhisperLanguage, WhisperSource};
use serde::Deserialize;
use serde_with::{serde_as, DisplayFromStr};
use tauri::AppHandle;
use tauri_plugin_channel::Channel;
use tokio::{select, spawn, sync::mpsc};
use tokio_util::sync::CancellationToken;

use crate::{
    commands::common::build_channel,
    utils::{
        event::{CommandReceiver, Event, EventProducer},
        result::{Error, Result},
    },
};

use super::{common::build_loading_handler, ffmpeg::get_audio_duration_secs};

#[serde_as]
#[derive(Deserialize)]
pub struct WhisperConf {
    audio_path: PathBuf,

    #[serde_as(as = "DisplayFromStr")]
    language: WhisperLanguage,

    #[serde_as(as = "DisplayFromStr")]
    model: WhisperSource,
}

#[tauri::command]
pub async fn whisper_transcriber(app_handle: AppHandle, conf: WhisperConf) -> Channel {
    let (producer, receiver, channel) = build_channel(app_handle);
    spawn(async move {
        let mut producer_2 = producer.clone();
        if let Err(err) = whisper_transcriber_internal(conf, producer, receiver).await {
            producer_2.send(Err(err)).await
        }
    });
    channel
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
    let canc_token: CancellationToken = receiver.into();

    let whisper = Whisper::builder()
        .with_language(Some(conf.language))
        .with_source(conf.model)
        .build_with_loading_handler(build_loading_handler(&producer))
        .await
        .map_err(|_| Error::Whisper)?;

    producer.send(Ok(Event::Progress(0))).await;

    whisper
        .transcribe_into(audio, tx)
        .map_err(|_| Error::Whisper)?;

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
                        let progress = u8::min((transcribed.progress() * 100.).floor() as u8, 100);
                        let offset = transcribed.start();
                        let remaining_time = transcribed.remaining_time();
                        let mut duration_secs = transcribed.duration();

                        //transcribed.duration() seems to be fixed at 30.
                        //This can brake progress count when the last segment real duration <30
                        if offset + duration_secs > audio_duration_secs {
                            duration_secs = audio_duration_secs - offset;
                        }
                        producer.send(Ok(Event::DeltaProgress(progress))).await;
                        producer.send(Ok(Event::TranscriptionSegment{text, probability_of_no_speech, offset, duration_secs, remaining_time})).await;
                    },
                    None => {
                        producer.send(Ok(Event::Progress(100))).await;
                        break;
                    }
                }
            }
        }
    }
    Ok(())
}

fn load_audio(path: &Path) -> Result<Decoder<BufReader<File>>> {
    let file = BufReader::new(File::open(path)?);
    Decoder::new(file).map_err(Into::into)
}

#[cfg(test)]
mod test {
    use std::path::PathBuf;

    use tokio::spawn;

    use crate::{
        commands::{accelerator::get_accelerator, common::build_local_channel},
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
        let model = kalosm_sound::WhisperSource::Base;
        let conf = WhisperConf {
            audio_path: PathBuf::from(test_file!("gitbar_189_110_secs.mp3")),
            language: kalosm_sound::WhisperLanguage::Italian,
            model: model,
        };

        copy_binary_to_deps("ffprobe").unwrap();

        let accelerator = get_accelerator().await;
        println!("Using {accelerator:?} library");
        println!("Using {model} model");

        let (producer, receiver, mut rx_event, tx_command) = build_local_channel();
        let _ = tx_command.send(Command::Start).await;

        spawn(async move { whisper_transcriber_internal(conf, producer, receiver).await });

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
                    Event::Progress(0) => println!("Download phase completed"),
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
