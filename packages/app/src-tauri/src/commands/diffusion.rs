use std::path::PathBuf;

use kalosm_vision::{Wuerstchen, WuerstchenInferenceSettings};
use serde::Deserialize;
use tauri::AppHandle;
use tauri_plugin_channel::Channel;
use tokio::{select, spawn, sync::mpsc};
use tokio_util::sync::CancellationToken;
use uuid::Uuid;

use crate::{
    commands::common::build_channel,
    utils::{
        event::{CommandReceiver, Event, EventProducer},
        file::create_app_folder,
        result::{Error, Result},
    },
};

use super::common::build_loading_handler;

const IMAGE_FOLDER: &str = "images_wuerstchen";

#[derive(Deserialize)]
pub struct WuerstchenConf {
    prompt: String,
    flash_attn: bool,
    negative_prompt: Option<String>,
    width: Option<usize>,
    height: Option<usize>,
    prior_guidance_scale: Option<f64>,
    sample_count: Option<i64>,

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

        if let Some(prior_guidance_scale) = value.prior_guidance_scale {
            settings = settings.with_prior_guidance_scale(prior_guidance_scale);
        }

        if let Some(sample_count) = value.sample_count {
            settings = settings.with_sample_count(sample_count);
        }

        settings
    }
}

#[tauri::command]
pub async fn wuerstchen_diffusion(app_handle: AppHandle, conf: WuerstchenConf) -> Channel {
    let (producer, receiver, channel) = build_channel(app_handle);
    spawn(async move {
        let mut producer_2 = producer.clone();
        if let Err(err) = wuerstchen_diffusion_internal(conf, producer, receiver).await {
            producer_2.send(Err(err)).await
        }
    });
    channel
}

async fn wuerstchen_diffusion_internal(
    conf: WuerstchenConf,
    mut producer: EventProducer,
    receiver: CommandReceiver,
) -> Result<()> {
    receiver.started().await;
    let (tx, mut rx) = mpsc::unbounded_channel();
    let path = conf.dest_path.clone();

    let model = Wuerstchen::builder()
        .with_flash_attn(conf.flash_attn)
        .build_with_loading_handler(build_loading_handler(&producer))
        .await
        .map_err(|_| Error::Wuerstchen)?;

    producer.send(Ok(Event::Working)).await;
    let canc_token: CancellationToken = receiver.into();

    model
        .run_into(conf.into(), tx)
        .map_err(|_| Error::Wuerstchen)?;

    loop {
        select! {
            _ = canc_token.cancelled() => {
                producer.send(Err(Error::Aborted)).await;
                break
            }
            res = rx.recv() => {
                match res {
                    Some(data) => {
                        if let Some(img) = data.generated_image() {
                            let progress = u8::min((data.progress() * 100.).floor() as u8, 100);
                            let mut path = path.clone();
                            let uuid = Uuid::new_v4();
                            path.push(format!("{uuid}.png"));
                            let _ = img.save(&path);
                            producer.send(Ok(Event::DeltaProgress(progress))).await;
                            producer.send(Ok(Event::DiffusionImage{ image: path, remaining_time: data.remaining_time()})).await
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
            accelerator::get_accelerator,
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
            prompt: "a cute cat with a hat in a room covered with fur with incredible detail"
                .to_owned(),
            flash_attn: false,
            negative_prompt: None,
            width: Some(1024),
            height: Some(1024),
            prior_guidance_scale: None,
            dest_path: images_app_folder(),
            sample_count: Some(1),
        };

        let accelerator = get_accelerator().await;
        println!("Using {accelerator:?} library");

        let (producer, receiver, mut rx_event, tx_command) = build_local_channel();
        let _ = tx_command.send(Command::Start).await;
        spawn(async move { wuerstchen_diffusion_internal(conf, producer, receiver).await });

        let mut test_diffusion = false;
        while let Some(data) = rx_event.recv().await {
            match data {
                Ok(event) => match event {
                    Event::DownloadProgress { file, progress } => {
                        println!("Downloading {file}: {progress}%");
                    }
                    Event::DiffusionImage { image, .. } => {
                        println!("{image:?}");
                        test_diffusion = true;
                    }
                    Event::Working => println!("Download phase completed"),
                    _ => (),
                },
                Err(_) => (),
            }
        }
        assert!(test_diffusion);
    }
}
