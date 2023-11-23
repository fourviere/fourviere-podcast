#[tauri::command]
pub async fn set_log_status(status: bool) -> bool {
    match crate::utils::log::set_log_status(status) {
    Ok(_) => status,
    Err(val) => val,
}
}

#[tauri::command]
pub async fn log_status() -> bool {
    crate::utils::log::log_status()
}
