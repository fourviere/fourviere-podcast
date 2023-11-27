#[tauri::command]
pub async fn set_log_status(status: bool) -> bool {
    crate::utils::log::set_log_status(status);
    status
}

#[tauri::command]
pub async fn log_status() -> bool {
    crate::utils::log::log_status()
}

#[cfg(test)]
mod test {
    use std::time::Duration;

    use tokio::time::sleep;

    use crate::commands::log::{log_status, set_log_status};

    #[tokio::test]
    async fn test_log_status() {
        let _ = set_log_status(true).await;
        assert!(log_status().await);

        tokio::spawn(async move {
            set_log_status(false).await;
        });

        sleep(Duration::from_secs(1)).await;
        assert!(!log_status().await);
    }
}
