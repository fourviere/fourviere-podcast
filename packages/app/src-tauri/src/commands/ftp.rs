use ::function_name::named;
use get_chunk::iterator::FileIter;
use serde::{Deserialize, Serialize};
use std::{borrow::Cow, path::Path, str};
use suppaftp::{types::FileType, AsyncFtpStream, Mode};
use tauri::Window;
use tokio::io::AsyncWriteExt;
use tokio::spawn;
use tokio_util::compat::{FuturesAsyncWriteCompatExt, TokioAsyncReadCompatExt};
use uuid::Uuid;

use crate::log_if_error_and_return;
use crate::utils::event::{Channel, Event, EventProducer};
use crate::utils::file::get_file_info;
use crate::utils::result::Result;

#[derive(Deserialize)]
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

#[derive(Debug, PartialEq, Serialize)]
pub struct FileInfo {
    pub url: String,
    pub mime_type: String,
    pub size: u64,
}

#[tauri::command]
pub async fn ftp_upload_window_with_progress(window: Window, payload: Payload) -> Uuid {
    ftp_upload_with_progress(window.into(), payload)
}

#[named]
fn ftp_upload_with_progress(channel: Channel, payload: Payload) -> Uuid {
    let mut event_producer = EventProducer::new(channel);
    let id = event_producer.id();

    spawn(async move {
        let result = ftp_upload_with_progress_task(&mut event_producer, payload)
            .await
            .map(Event::FtpResult);
        log_if_error_and_return!(&result);
        event_producer.send(result).await;
    });

    id
}

async fn ftp_upload_with_progress_task(
    event_producer: &mut EventProducer,
    payload: Payload,
) -> Result<FileInfo> {
    // Init Phase: 15%
    event_producer.send(Ok(Event::Progress(0))).await;

    let addr = format!("{}:{}", payload.host, payload.port);

    let mut ftp_stream = AsyncFtpStream::connect(addr).await?;

    event_producer.send(Ok(Event::Progress(5))).await;

    ftp_stream.login(&payload.user, &payload.password).await?;

    event_producer.send(Ok(Event::Progress(7))).await;

    // As default set the FTP connection to passive mode
    ftp_stream.set_mode(Mode::Passive);

    // https://www.iana.org/assignments/ftp-commands-extensions/ftp-commands-extensions.xhtml
    if ftp_stream
        .feat()
        .await
        .is_ok_and(|opts| opts.get("EPSV").is_some())
    {
        ftp_stream.set_mode(Mode::ExtendedPassive);
    }

    event_producer.send(Ok(Event::Progress(10))).await;

    if let Some(path) = &payload.path {
        ftp_stream.cwd(path).await?;
    }

    ftp_stream.transfer_type(FileType::Binary).await?;

    event_producer.send(Ok(Event::Progress(12))).await;

    let file_info = get_file_info(&payload.local_path).await?;

    let ext = Path::new(&payload.local_path)
        .extension()
        .map_or(Cow::default(), |ext| ext.to_string_lossy());

    event_producer.send(Ok(Event::Progress(15))).await;

    // Trasfer phase: 80%

    // Step by 8%
    let file_iter =
        FileIter::new(payload.local_path.as_ref())?.set_mode(get_chunk::ChunkSize::Percent(10.));

    let mut writer = ftp_stream
        .put_with_stream(format!("{}.{}", &payload.file_name, &ext))
        .await?
        .compat_write();

    for (index, chunk) in file_iter.enumerate() {
        writer.write_all(&chunk?).await?;

        let progress = 15 + (index as u8 * 8);
        event_producer.send(Ok(Event::Progress(progress))).await;
    }

    ftp_stream.finalize_put_stream(writer.into_inner()).await?;

    // Fin phase: 5%
    ftp_stream.quit().await?;

    let protocol = if payload.https { "https" } else { "http" };

    let file_path = match payload.path.filter(|path| !path.is_empty()) {
        Some(path) => format!("{}/{}.{}", path, payload.file_name, ext),
        None => format!("{}.{}", payload.file_name, ext),
    };

    event_producer.send(Ok(Event::Progress(100))).await;

    Ok(FileInfo {
        size: file_info.size,
        mime_type: file_info.mime_type,
        url: format!("{}://{}/{}", protocol, payload.http_host, file_path),
    })
}

#[named]
#[tauri::command]
pub async fn ftp_upload(payload: Payload) -> Result<FileInfo> {
    let upload_result = ftp_upload_internal(payload).await;
    log_if_error_and_return!(upload_result)
}

async fn ftp_upload_internal(payload: Payload) -> Result<FileInfo> {
    let addr = format!("{}:{}", payload.host, payload.port);

    let mut ftp_stream = AsyncFtpStream::connect(addr).await?;

    ftp_stream.login(&payload.user, &payload.password).await?;

    // As default set the FTP connection to passive mode
    ftp_stream.set_mode(Mode::Passive);

    // https://www.iana.org/assignments/ftp-commands-extensions/ftp-commands-extensions.xhtml
    if ftp_stream
        .feat()
        .await
        .is_ok_and(|opts| opts.get("EPSV").is_some())
    {
        ftp_stream.set_mode(Mode::ExtendedPassive);
    }

    if let Some(path) = &payload.path {
        ftp_stream.cwd(path).await?;
    }

    ftp_stream.transfer_type(FileType::Binary).await?;

    let file_info = get_file_info(&payload.local_path).await?;

    let ext = Path::new(&payload.local_path)
        .extension()
        .map_or(Cow::default(), |ext| ext.to_string_lossy());

    let mut reader = tokio::fs::File::open(&payload.local_path)
        .await
        .map(tokio::io::BufReader::new)?
        .compat();

    ftp_stream
        .put_file(&format!("{}.{}", &payload.file_name, &ext), &mut reader)
        .await?;

    ftp_stream.quit().await?;

    let protocol = if payload.https { "https" } else { "http" };

    let file_path = match payload.path.filter(|path| !path.is_empty()) {
        Some(path) => format!("{}/{}.{}", path, payload.file_name, ext),
        None => format!("{}.{}", payload.file_name, ext),
    };

    Ok(FileInfo {
        size: file_info.size,
        mime_type: file_info.mime_type,
        url: format!("{}://{}/{}", protocol, payload.http_host, file_path),
    })
}

#[cfg(test)]
mod test {
    use std::{sync::Arc, time::Duration};

    use async_trait::async_trait;
    use libunftp::{
        auth::{AuthenticationError, Authenticator, Credentials, DefaultUser},
        ServerError,
    };
    use tempfile::tempdir;
    use tokio::{spawn, sync::mpsc::channel, time::sleep};

    use crate::{
        commands::ftp::{ftp_upload, ftp_upload_with_progress, Payload},
        test_file,
    };

    #[cfg(target_os = "windows")]
    const FILESIZE: u64 = 9156;

    #[cfg(target_os = "linux")]
    const FILESIZE: u64 = 9063;

    #[cfg(target_os = "macos")]
    const FILESIZE: u64 = 9063;

    const USER: &str = "ForuviereTestUser";
    const PASSWORD: &str = "StealThisUselessPassword";

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
                USER => match creds.password.as_deref() {
                    Some(PASSWORD) => Ok(DefaultUser),
                    _ => Err(AuthenticationError::BadPassword),
                },
                _ => Err(AuthenticationError::BadUser),
            }
        }
    }

    async fn ftp_server(port: u16) -> Result<(), ServerError> {
        let tmp_dir = tempdir()?;
        let server = libunftp::Server::with_authenticator(
            Box::new(move || unftp_sbe_fs::Filesystem::new(tmp_dir.path())),
            Arc::new(TestAuthenticator {}),
        )
        .passive_ports(50000..65535);

        server.listen(format!("127.0.0.1:{}", port)).await
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ftp_upload_ok() {
        let port = 2121;
        let payload = Payload {
            host: "localhost".to_owned(),
            port: port,
            user: USER.to_owned(),
            password: PASSWORD.to_owned(),
            local_path: test_file!("gitbar.xml").to_owned(),
            path: None,
            file_name: "gitbar".to_owned(),
            http_host: "localhost".to_owned(),
            https: false,
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;

        let info_result = ftp_upload(payload).await;
        assert!(info_result.is_ok());
        let file_info = info_result.unwrap();
        assert_eq!(file_info.size, FILESIZE);
        assert_eq!(file_info.mime_type, "text/xml");

        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ftp_upload_err_host() {
        let port = 2122;
        let payload = Payload {
            host: "localhosts".to_owned(),
            port: port,
            user: USER.to_owned(),
            password: PASSWORD.to_owned(),
            local_path: test_file!("gitbar.xml").to_owned(),
            path: None,
            file_name: "gitbar".to_owned(),
            http_host: "localhosts".to_owned(),
            https: false,
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        assert!(ftp_upload(payload).await.is_err());
        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ftp_upload_err_user() {
        let port = 2123;
        let payload = Payload {
            host: "localhost".to_owned(),
            port: port,
            user: "NotAValidUserName".to_owned(),
            password: PASSWORD.to_owned(),
            local_path: test_file!("gitbar.xml").to_owned(),
            path: None,
            file_name: "gitbar".to_owned(),
            http_host: "localhost".to_owned(),
            https: false,
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        assert!(ftp_upload(payload).await.is_err());
        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ftp_upload_err_local_path() {
        let port = 2124;
        let payload = Payload {
            host: "localhost".to_owned(),
            port: port,
            user: USER.to_owned(),
            password: PASSWORD.to_owned(),
            local_path: test_file!("gitbar.rss").to_owned(),
            path: None,
            file_name: "gitbar".to_owned(),
            http_host: "localhost".to_owned(),
            https: false,
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        assert!(ftp_upload(payload).await.is_err());
        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ftp_upload_progress_ok() {
        let port = 2125;
        let payload = Payload {
            host: "localhost".to_owned(),
            port: port,
            user: USER.to_owned(),
            password: PASSWORD.to_owned(),
            local_path: test_file!("gitbar.xml").to_owned(),
            path: None,
            file_name: "gitbar".to_owned(),
            http_host: "localhost".to_owned(),
            https: false,
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;

        let (tx, mut rx) = channel(2);
        let original_id = ftp_upload_with_progress(tx.into(), payload);
        let mut at_least_one_progress = false;
        let mut at_least_one_result = false;

        while let Some((id, event)) = rx.recv().await {
            assert_eq!(original_id, id);
            match event {
                Ok(event) => match event {
                    crate::utils::event::Event::Progress(_) => at_least_one_progress = true,
                    crate::utils::event::Event::FtpResult(file_info) => {
                        assert_eq!(file_info.size, FILESIZE);
                        assert_eq!(file_info.mime_type, "text/xml");
                        at_least_one_result = true;
                    }
                    _ => panic!("Event not allowed: {:?}", event),
                },
                Err(err) => panic!("{:?}", err),
            }
        }

        assert!(at_least_one_progress);
        assert!(at_least_one_result);

        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ftp_upload_progress_err_host() {
        let port = 2126;
        let payload = Payload {
            host: "localhosts".to_owned(),
            port: port,
            user: USER.to_owned(),
            password: PASSWORD.to_owned(),
            local_path: test_file!("gitbar.xml").to_owned(),
            path: None,
            file_name: "gitbar".to_owned(),
            http_host: "localhosts".to_owned(),
            https: false,
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;

        let (tx, mut rx) = channel(2);
        let original_id = ftp_upload_with_progress(tx.into(), payload);
        let mut at_least_one_error = false;

        while let Some((id, event)) = rx.recv().await {
            assert_eq!(original_id, id);
            match event {
                Ok(_) => (),
                Err(_) => at_least_one_error = true,
            }
        }

        assert!(at_least_one_error);

        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ftp_upload_progress_err_user() {
        let port = 2127;
        let payload = Payload {
            host: "localhost".to_owned(),
            port: port,
            user: "NotAValidUserName".to_owned(),
            password: PASSWORD.to_owned(),
            local_path: test_file!("gitbar.xml").to_owned(),
            path: None,
            file_name: "gitbar".to_owned(),
            http_host: "localhost".to_owned(),
            https: false,
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;

        let (tx, mut rx) = channel(2);
        let original_id = ftp_upload_with_progress(tx.into(), payload);
        let mut at_least_one_error = false;

        while let Some((id, event)) = rx.recv().await {
            assert_eq!(original_id, id);
            match event {
                Ok(_) => (),
                Err(_) => at_least_one_error = true,
            }
        }

        assert!(at_least_one_error);

        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ftp_upload_progress_err_local_path() {
        let port = 2128;
        let payload = Payload {
            host: "localhost".to_owned(),
            port: port,
            user: USER.to_owned(),
            password: PASSWORD.to_owned(),
            local_path: test_file!("gitbar.rss").to_owned(),
            path: None,
            file_name: "gitbar".to_owned(),
            http_host: "localhost".to_owned(),
            https: false,
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;

        let (tx, mut rx) = channel(2);
        let original_id = ftp_upload_with_progress(tx.into(), payload);
        let mut at_least_one_error = false;

        while let Some((id, event)) = rx.recv().await {
            assert_eq!(original_id, id);
            match event {
                Ok(_) => (),
                Err(_) => at_least_one_error = true,
            }
        }

        assert!(at_least_one_error);

        handle.abort();
    }
}
