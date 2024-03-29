use std::path::PathBuf;

use function_name::named;
use kalosm_vision::{ModelLoadingProgress, Wuerstchen, WuerstchenInferenceSettings};
use serde::Deserialize;
use tauri::{async_runtime::spawn_blocking, AppHandle};
use tauri_plugin_channel::Channel;
use tokio::{select, spawn};
use tokio_util::sync::CancellationToken;
use uuid::Uuid;

use crate::{
    commands::common::build_channel,
    log_if_error_and_return,
    utils::{
        event::{CommandReceiver, Event, EventProducer},
        file::create_app_folder,
        result::{Error, Result},
    },
};

const IMAGE_FOLDER: &str = "images_wuerstchen";

#[derive(Deserialize)]
pub struct WuerstchenConf {
    prompt: String,
    flash_attn: bool,
    negative_prompt: Option<String>,
    width: Option<usize>,
    height: Option<usize>,
    sliced_attention_size: Option<usize>,
    n_steps: Option<usize>,
    num_samples: Option<i64>,

    #[serde(skip_deserializing, default = "images_app_folder")]
    dest_path: PathBuf,
}

impl From<WuerstchenConf> for WuerstchenInferenceSettings {
    fn from(value: WuerstchenConf) -> Self {
        let mut settings = WuerstchenInferenceSettings::new(value.prompt);

        if let Some(negative_prompt) = value.negative_prompt {
            settings = settings.with_negative_prompt(negative_prompt);
        }

        if let Some(width) = value.width {
            settings = settings.with_width(width);
        }

        if let Some(height) = value.height {
            settings = settings.with_height(height);
        }

        if let Some(sliced_attention_size) = value.sliced_attention_size {
            settings = settings.with_sliced_attention_size(sliced_attention_size);
        }

        if let Some(n_steps) = value.n_steps {
            settings = settings.with_n_steps(n_steps);
        }

        if let Some(num_samples) = value.num_samples {
            settings = settings.with_num_samples(num_samples);
        }

        settings
    }
}

#[named]
#[tauri::command]
pub async fn wuerstchen_diffusion(app_handle: AppHandle, conf: WuerstchenConf) -> Result<Channel> {
    let (producer, receiver, channel) = build_channel(app_handle);
    let result = wuerstchen_diffusion_internal(conf, producer, receiver).await;
    log_if_error_and_return!(result)?;
    Ok(channel)
}

async fn wuerstchen_diffusion_internal(
    conf: WuerstchenConf,
    mut producer: EventProducer,
    receiver: CommandReceiver,
) -> Result<()> {
    receiver.started().await;
    let producer_download = producer.clone();
    let mut last_progress: u8 = 0;

    let path = conf.dest_path.clone();
    let model = Wuerstchen::builder()
        .with_flash_attn(conf.flash_attn)
        .build_with_loading_handler(move |data| {
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
        })
        .await
        .map_err(|_| Error::Wuerstchen)?;

    producer.send(Ok(Event::Working)).await;

    spawn(async move {
        let canc_token: CancellationToken = receiver.into();

        select! {
            _ = canc_token.cancelled() => (),
            res = spawn_blocking(move || {
                model.run(conf.into())
            }) => {
                match res {
                    Ok(Ok(images)) => {
                        let paths = images.iter().map(|img| {
                            let mut path = path.clone();
                            let uuid = Uuid::new_v4();
                            path.push(format!("{uuid}.png"));
                            let _ = img.save(&path);
                            path
                        }).collect();
                        producer.send(Ok(Event::DiffusionImages(paths))).await
                    },
                    _ => producer.send(Err(Error::Wuerstchen)).await,
                }
            }
        }
    });
    Ok(())
}

fn images_app_folder() -> PathBuf {
    create_app_folder(IMAGE_FOLDER).unwrap()
}

#[cfg(test)]
mod test {
    use tokio::spawn;

    use crate::{
        commands::{
            common::build_local_channel,
            diffusion::{images_app_folder, wuerstchen_diffusion_internal},
        },
        utils::event::{Command, Event},
    };

    use super::WuerstchenConf;

    #[ignore]
    #[tokio::test(flavor = "multi_thread")]
    async fn simple_diffusion_test() {
        let conf = WuerstchenConf {
            prompt: "An hipster Pikachu".to_owned(),
            flash_attn: false,
            negative_prompt: None,
            width: Some(32),
            height: Some(32),
            sliced_attention_size: Some(128),
            n_steps: Some(1),
            dest_path: images_app_folder(),
            num_samples: Some(1),
        };

        let (producer, receiver, mut rx_event, tx_command) = build_local_channel();
        let _ = tx_command.send(Command::Start).await;
        spawn(async move {
            assert!(wuerstchen_diffusion_internal(conf, producer, receiver)
                .await
                .is_ok())
        });
        let mut test_diffusion = false;
        while let Some(transcribed) = rx_event.recv().await {
            match transcribed {
                Ok(event) => match event {
                    Event::DownloadProgress { file, progress } => {
                        println!("Downloading {file}: {progress}%");
                    }
                    Event::DiffusionImages { .. } => {
                        test_diffusion = true;
                    }
                    _ => (),
                },
                Err(_) => (),
            }
        }
        assert!(test_diffusion);
    }
}
