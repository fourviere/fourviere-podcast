use reqwest;

#[tauri::command]
pub async fn fetch_feed(url: &str) -> Result<String, String> {
    let response = reqwest::get(url).await;
    return match response {
        Ok(resp) => Ok(resp.text().await.unwrap()),
        Err(_) => Err("Error getting the data from remote endpoint".to_string()),
    };
}
