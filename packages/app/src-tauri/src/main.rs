// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use utils::log::log_settings;

mod commands;
mod utils;

fn main() {
    let (level, targets, filter) = log_settings();
    tauri::Builder::default()
        .plugin(
            tauri_plugin_log::Builder::default()
                .targets(targets)
                .level(level)
                .filter(filter)
                .build(),
        )
        .plugin(tauri_plugin_channel::init())
        .invoke_handler(tauri::generate_handler![
            commands::network::fetch_feed,
            commands::fs::read_text_file,
            commands::fs::read_file_info,
            commands::s3::s3_upload,
            commands::s3::s3_upload_progress,
            commands::s3::s3_xml_upload,
            commands::s3::s3_xml_upload_progress,
            commands::ftp::ftp_upload,
            commands::ftp::ftp_upload_progress,
            commands::ftp::ftp_xml_upload,
            commands::ftp::ftp_xml_upload_progress,
            commands::log::log_status,
            commands::log::set_log_status,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
