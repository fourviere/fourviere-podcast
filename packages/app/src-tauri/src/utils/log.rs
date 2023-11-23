use std::sync::OnceLock;

use log::{LevelFilter, Metadata};
use tauri_plugin_log::LogTarget;

const LOG_LEVEL: LevelFilter = LevelFilter::Error;
const LOG_TARGETS: [LogTarget; 3] = [LogTarget::Stderr, LogTarget::LogDir, LogTarget::Webview];

static LOG_ENABLED: OnceLock<bool> = OnceLock::new();

pub fn log_settings() -> (
    LevelFilter,
    Vec<LogTarget>,
    impl Fn(&Metadata<'_>) -> bool + Send + Sync + 'static,
) {
    (LOG_LEVEL, Vec::from(LOG_TARGETS), filter_log)
}

pub fn set_log_status(status: bool) -> Result<(),bool> {
    LOG_ENABLED.set(status)
}
#[cfg(debug_assertions)]
pub fn log_status() -> bool {
    *LOG_ENABLED.get_or_init(|| true)
}

#[cfg(not(debug_assertions))]
pub fn log_status() -> bool {
    *LOG_ENABLED.get_or_init(|| false)
}

fn filter_log(_: &Metadata<'_>) -> bool {
    log_status()
}

#[macro_export]
macro_rules! log_if_error {
    ($result:expr) => {
        if let Err(err) = &$result {
            error!("{} function failed: {:?}", function_name!(), err);
            $result
        } else {
            $result
        }
    };
}
