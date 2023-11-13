use std::path::Path;
use std::str;
use suppaftp::types::FileType;
use suppaftp::{AsyncFtpStream, Mode};
use tokio_util::compat::TokioAsyncReadCompatExt;

#[derive(serde::Deserialize)]
pub struct Payload {
    host: String,
    port: u16,
    user: String,
    password: String,
    local_path: String,
    path: Option<String>,
    file_name: String,
    http_host: String,
    https: bool,
}

#[tauri::command]
pub async fn ftp_upload(payload: Payload) -> Result<String, String> {
    let addr = format!("{}:{}", payload.host, payload.port)
        .as_str()
        .to_string();

    let mut ftp_stream = AsyncFtpStream::connect(addr)
        .await
        .map_err(|_| "Failed to connect to server".to_string())?;

    ftp_stream
        .login(&payload.user, &payload.password)
        .await
        .map_err(|_| "Failed to login to server".to_string())?;

    // https://www.iana.org/assignments/ftp-commands-extensions/ftp-commands-extensions.xhtml
    if ftp_stream
        .feat()
        .await
        .is_ok_and(|opts| opts.get("EPSV").is_some())
    {
        ftp_stream.set_mode(Mode::ExtendedPassive);
    }

    if let Some(path) = &payload.path {
        ftp_stream
            .cwd(path)
            .await
            .map_err(|_| "Failed to change directory".to_string())?;
    }

    ftp_stream
        .transfer_type(FileType::Binary)
        .await
        .map_err(|_| "Failed setting transfer type".to_string())?;

    let ext = Path::new(&payload.local_path)
        .extension()
        .map_or("".to_string(), |ext| ext.to_string_lossy().to_string());

    let mut reader = tokio::fs::File::open(&payload.local_path)
        .await
        .map(tokio::io::BufReader::new)
        .map_err(|_| "Failed to open file".to_string())?
        .compat();

    ftp_stream
        .put_file(&format!("{}.{}", &payload.file_name, &ext), &mut reader)
        .await
        .map_err(|err| err.to_string())?;

    let _ = ftp_stream
        .quit()
        .await
        .map_err(|_| "Failed to quit".to_string());

    let protocol = if payload.https { "https" } else { "http" };

    Ok(format!(
        "{}://{}/{}/{}.{}",
        protocol,
        payload.http_host,
        payload.path.unwrap_or("".to_string()),
        payload.file_name,
        ext
    ))
}

#[cfg(test)]
mod test {
    use std::{sync::Arc, time::Duration};

    use async_trait::async_trait;
    use libunftp::{
        auth::{AuthenticationError, Authenticator, Credentials, DefaultUser},
        ServerError,
    };
    use tokio::time::sleep;

    use crate::{
        commands::ftp::{ftp_upload, Payload},
        test_file,
    };

    #[derive(Debug)]
    struct TestAuthenticator;

    #[async_trait]
    impl Authenticator<DefaultUser> for TestAuthenticator {
        async fn authenticate(
            &self,
            username: &str,
            creds: &Credentials,
        ) -> Result<DefaultUser, AuthenticationError> {
            match username {
                "ForuviereTestUser" => match creds.password.as_deref() {
                    Some("StealThisUselessPassword") => Ok(DefaultUser),
                    _ => Err(AuthenticationError::BadPassword),
                },
                _ => Err(AuthenticationError::BadUser),
            }
        }
    }

    async fn ftp_server(port: u16) -> Result<(), ServerError> {
        let server = libunftp::Server::with_authenticator(
            Box::new(move || unftp_sbe_fs::Filesystem::new("/tmp")),
            Arc::new(TestAuthenticator {}),
        )
        .passive_ports(50000..65535);

        server.listen(format!("127.0.0.1:{}", port)).await
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ftp_upload_ok() {
        let port = 2121;
        let payload = Payload {
            host: "localhost".to_string(),
            port: port,
            user: "ForuviereTestUser".to_string(),
            password: "StealThisUselessPassword".to_string(),
            local_path: test_file!("gitbar.xml").to_string(),
            path: None,
            file_name: "gitbar".to_string(),
            http_host: "localhost".to_string(),
            https: false,
        };

        let handle = tokio::spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        assert!(ftp_upload(payload).await.is_ok());
        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ftp_upload_err_host() {
        let port = 2122;
        let payload = Payload {
            host: "localhosts".to_string(),
            port: port,
            user: "ForuviereTestUser".to_string(),
            password: "StealThisUselessPassword".to_string(),
            local_path: test_file!("gitbar.xml").to_string(),
            path: None,
            file_name: "gitbar".to_string(),
            http_host: "localhosts".to_string(),
            https: false,
        };

        let handle = tokio::spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        assert!(ftp_upload(payload)
            .await
            .is_err_and(|err| err == "Failed to connect to server"));
        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ftp_upload_err_user() {
        let port = 2123;
        let payload = Payload {
            host: "localhost".to_string(),
            port: port,
            user: "NotAValidUserName".to_string(),
            password: "StealThisUselessPassword".to_string(),
            local_path: test_file!("gitbar.xml").to_string(),
            path: None,
            file_name: "gitbar".to_string(),
            http_host: "localhost".to_string(),
            https: false,
        };

        let handle = tokio::spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        assert!(ftp_upload(payload)
            .await
            .is_err_and(|err| err == "Failed to login to server"));
        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ftp_upload_err_local_path() {
        let port = 2124;
        let payload = Payload {
            host: "localhost".to_string(),
            port: port,
            user: "ForuviereTestUser".to_string(),
            password: "StealThisUselessPassword".to_string(),
            local_path: test_file!("gitbar.rss").to_string(),
            path: None,
            file_name: "gitbar".to_string(),
            http_host: "localhost".to_string(),
            https: false,
        };

        let handle = tokio::spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        assert!(ftp_upload(payload)
            .await
            .is_err_and(|err| err == "Failed to open file"));
        handle.abort();
    }
}
