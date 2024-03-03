use function_name::named;
use keyring::Entry;

static SERVICE_NAME: &str = "FOURVIERE-PODCAST";

use crate::{log_if_error_and_return, utils::result::Result};

#[named]
#[tauri::command]
pub async fn get_secret(name: String) -> Result<String> {
    log_if_error_and_return!(internal_get_secret(&name))
}

#[named]
#[tauri::command]
pub async fn delete_secret(name: String) -> Result<()> {
    log_if_error_and_return!(internal_delete_secret(&name))
}

#[named]
#[tauri::command]
pub async fn set_secret(name: String, value: String) -> Result<()> {
    log_if_error_and_return!(internal_set_secret(&name, &value))
}

fn internal_set_secret(name: &str, value: &str) -> Result<()> {
    let entry = Entry::new(SERVICE_NAME, name)?;
    entry.set_password(value).map_err(Into::into)
}

fn internal_get_secret(name: &str) -> Result<String> {
    let entry = Entry::new(SERVICE_NAME, name)?;
    entry.get_password().map_err(Into::into)
}

fn internal_delete_secret(name: &str) -> Result<()> {
    let entry = Entry::new(SERVICE_NAME, name)?;
    entry.delete_password().map_err(Into::into)
}
