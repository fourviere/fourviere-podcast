use log::LevelFilter;
use tauri_plugin_log::LogTarget;

#[cfg(not(debug_assertions))]
const FORCE_DEBUG_LOG_FLAG: &str = "FOURVIERE_FORCE_DEBUG";

pub fn log_settings() -> (LevelFilter, Vec<LogTarget>) {
    (log_level(), log_targets())
}

#[cfg(debug_assertions)]
fn log_level() -> LevelFilter {
    LevelFilter::Debug
}

#[cfg(not(debug_assertions))]
fn log_level() -> LevelFilter {
    if std::env::var(FORCE_DEBUG_LOG_FLAG).is_ok_and(|val| val.eq_ignore_ascii_case("TRUE")) {
        LevelFilter::Debug
    } else {
        LevelFilter::Error
    }
}

#[cfg(debug_assertions)]
fn log_targets() -> Vec<LogTarget> {
    vec![LogTarget::Stderr, LogTarget::Webview]
}

#[cfg(not(debug_assertions))]
fn log_targets() -> Vec<LogTarget> {
    if std::env::var(FORCE_DEBUG_LOG_FLAG).is_ok_and(|val| val.eq_ignore_ascii_case("TRUE")) {
        vec![LogTarget::Stderr, LogTarget::Webview]
    } else {
        vec![LogTarget::LogDir]
    }
}
