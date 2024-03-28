use std::path::PathBuf;

use function_name::named;
use kalosm_vision::{Wuerstchen, WuerstchenInferenceSettings};
use serde::Deserialize;
use uuid::Uuid;

use crate::{
    log_if_error_and_return,
    utils::{
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

        settings
    }
}

#[named]
#[tauri::command]
pub async fn wuerstchen_diffusion(conf: WuerstchenConf) -> Result<PathBuf> {
    let result = wuerstchen_diffusion_internal(conf);
    log_if_error_and_return!(result)
}

fn wuerstchen_diffusion_internal(conf: WuerstchenConf) -> Result<PathBuf> {
    let mut path = conf.dest_path.clone();
    let model = Wuerstchen::builder()
        .with_flash_attn(conf.flash_attn)
        .build()
        .map_err(|_| Error::Wuerstchen)?;

    let image = model.run(conf.into()).map_err(|_| Error::Wuerstchen)?;
    if let Some(img) = image.iter().last() {
        let uuid = Uuid::new_v4();
        path.push(format!("{uuid}.png"));
        return img.save(&path).map(|_| path).map_err(|_| Error::Wuerstchen);
    }
    Err(Error::Wuerstchen)
}

fn images_app_folder() -> PathBuf {
    create_app_folder(IMAGE_FOLDER).unwrap()
}

#[cfg(test)]
mod test {
    use crate::commands::diffusion::{images_app_folder, wuerstchen_diffusion_internal};

    use super::WuerstchenConf;

    #[ignore]
    #[test]
    fn simple_diffusion_test() {
        let conf = WuerstchenConf {
            prompt: "An hipster Pikachu".to_owned(),
            flash_attn: false,
            negative_prompt: None,
            width: Some(32),
            height: Some(32),
            sliced_attention_size: Some(128),
            n_steps: Some(1),
            dest_path: images_app_folder(),
        };
        let result = wuerstchen_diffusion_internal(conf);
        println!("{result:?}");
        assert!(result.is_ok());
    }
}
