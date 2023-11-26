use std::sync::atomic::{AtomicBool, Ordering};

use log::{LevelFilter, Metadata};
use tauri_plugin_log::LogTarget;

const LOG_LEVEL: LevelFilter = LevelFilter::Error;
const LOG_TARGETS: [LogTarget; 3] = [LogTarget::Stderr, LogTarget::LogDir, LogTarget::Webview];

#[cfg(not(debug_assertions))]
static LOG_ENABLED: AtomicBool = AtomicBool::new(false);

#[cfg(debug_assertions)]
static LOG_ENABLED: AtomicBool = AtomicBool::new(true);

pub fn log_settings() -> (
    LevelFilter,
    Vec<LogTarget>,
    impl Fn(&Metadata<'_>) -> bool + Send + Sync + 'static,
) {
    (LOG_LEVEL, Vec::from(LOG_TARGETS), filter_log)
}

pub fn set_log_status(status: bool) {
    LOG_ENABLED.store(status, Ordering::Relaxed);
}

pub fn log_status() -> bool {
    LOG_ENABLED.load(Ordering::Relaxed)
}

fn filter_log(_: &Metadata<'_>) -> bool {
    log_status()
}

#[macro_export]
macro_rules! log_if_error_and_return {
    ($result:expr) => {
        if let Err(err) = &$result {
            log::error!("[{}] error: {err:?}", function_name!());
            $result
        } else {
            $result
        }
    };
}

#[cfg(test)]
mod test {
    use std::{
        thread::{self, spawn},
        time::Duration,
    };

    use crate::utils::log::{log_status, set_log_status};

    #[test]
    fn test_log_status() {
        set_log_status(true);
        assert!(log_status());

        spawn(|| {
            set_log_status(false);
        });

        thread::sleep(Duration::from_secs(1));
        assert!(!log_status())
    }
}
