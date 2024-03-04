use std::collections::HashMap;

use function_name::named;
use keyring::Entry;
use serde::{Deserialize, Serialize};

use crate::{log_if_error_and_return, utils::result::Result};

static SERVICE_NAME: &str = "FOURVIERE-PODCAST";

#[cfg(target_os = "macos")]
static MACOS_KEYRING: &str = "FOURVIERE-KEYRING";

// For unverified developers macos will prompt for login pwd each time a keyring-entry is polled/updated/deleted
// To avoid multiple prompts, entries are collected as json into a single keyring-entry
// Unfortunately is still required that user clicks on "always" on the first prompt
#[cfg(target_os = "macos")]
#[derive(Debug, Deserialize, Serialize)]
struct SecretMap {
    map: HashMap<String, String>,
}

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

#[cfg(not(target_os = "macos"))]
fn internal_set_secret(name: &str, value: &str) -> Result<()> {
    let entry = Entry::new(SERVICE_NAME, name)?;
    entry.set_password(value).map_err(Into::into)
}

#[cfg(target_os = "macos")]
fn internal_set_secret(name: &str, value: &str) -> Result<()> {
    let mut secrets = get_secret_map()?;
    let _ = secrets.map.insert(name.to_string(), value.to_string());
    let pwd = serde_json::to_string(&secrets)?;
    println!("{pwd}");
    let entry = Entry::new(SERVICE_NAME, MACOS_KEYRING)?;
    entry.set_password(&pwd).map_err(Into::into)
}

#[cfg(not(target_os = "macos"))]
fn internal_get_secret(name: &str) -> Result<String> {
    let entry = Entry::new(SERVICE_NAME, name)?;
    entry.get_password().map_err(Into::into)
}
#[cfg(target_os = "macos")]
fn internal_get_secret(name: &str) -> Result<String> {
    let secrets = get_secret_map()?;
    Ok(secrets
        .map
        .get(name)
        .map(|val| val.to_owned())
        .unwrap_or_default())
}

#[cfg(not(target_os = "macos"))]
fn internal_delete_secret(name: &str) -> Result<()> {
    let entry = Entry::new(SERVICE_NAME, name)?;
    entry.delete_password().map_err(Into::into)
}

#[cfg(target_os = "macos")]
fn internal_delete_secret(name: &str) -> Result<()> {
    let entry = Entry::new(SERVICE_NAME, MACOS_KEYRING)?;
    let mut pwd = entry.get_password()?;
    let mut secrets: SecretMap = serde_json::from_str(&pwd)?;
    secrets.map.remove(name);
    pwd = serde_json::to_string(&secrets)?;
    entry.set_password(&pwd).map_err(Into::into)
}

#[cfg(target_os = "macos")]
fn get_secret_map() -> Result<SecretMap> {
    let entry = Entry::new(SERVICE_NAME, MACOS_KEYRING)?;
    let pwd = entry.get_password();
    match pwd {
        Ok(pwd) => serde_json::from_str(&pwd).map_err(Into::into),
        Err(_) => Ok(SecretMap {
            map: HashMap::new(),
        }),
    }
}
