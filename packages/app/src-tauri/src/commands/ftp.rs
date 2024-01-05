use ::function_name::named;
use get_chunk::iterator::FileIter;
use serde::Deserialize;
use std::{borrow::Cow, path::Path, str};
use suppaftp::{types::FileType, AsyncFtpStream, Mode};
use tauri::Window;
use tokio::{io::AsyncWriteExt, select, spawn};
use tokio_util::{
    compat::{FuturesAsyncWriteCompatExt, TokioAsyncReadCompatExt},
    sync::CancellationToken,
};
use uuid::Uuid;

use crate::{
    commands::common::get_cancellation_token,
    log_if_error_and_return,
    utils::{
        event::{Channel, Event, EventProducer},
        file::{get_file_info, write_string_to_temp_file, TempFile},
        result::{Error, Result},
    },
};

use super::common::{EndPointPayloadConf, FileInfo};

#[derive(Deserialize)]
struct FtpConnection {
    host: String,
    port: u16,
    user: String,
    password: String,
}

impl FtpConnection {
    async fn connect(&self) -> Result<AsyncFtpStream> {
        let addr = format!("{}:{}", self.host, self.port);
        let mut ftp_stream = AsyncFtpStream::connect(addr).await?;
        ftp_stream.login(&self.user, &self.password).await?;

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

        Ok(ftp_stream)
    }
}

#[derive(Deserialize)]
pub struct FilePayload {
    local_path: String,

    #[serde(flatten)]
    connection: FtpConnection,

    #[serde(flatten)]
    endpoint_config: EndPointPayloadConf,
}

#[derive(Deserialize)]
pub struct XmlPayload {
    content: String,

    #[serde(flatten)]
    connection: FtpConnection,

    #[serde(flatten)]
    endpoint_config: EndPointPayloadConf,
}

#[named]
#[tauri::command]
pub async fn ftp_xml_upload_window_progress(window: Window, payload: XmlPayload) -> Result<Uuid> {
    let result = ftp_xml_upload_with_progress_internal(window.into(), payload).await;
    log_if_error_and_return!(result)
}

#[tauri::command]
pub async fn ftp_upload_window_progress(window: Window, payload: FilePayload) -> Uuid {
    ftp_upload_progress_internal(window.into(), payload, None)
}

async fn ftp_xml_upload_with_progress_internal(
    channel: Channel,
    payload: XmlPayload,
) -> Result<Uuid> {
    let temp_file = write_string_to_temp_file(&payload.content, "xml").await?;

    let file_payload = FilePayload {
        connection: payload.connection,
        local_path: temp_file.path().to_owned(),
        endpoint_config: payload.endpoint_config,
    };

    Ok(ftp_upload_progress_internal(
        channel,
        file_payload,
        Some(temp_file),
    ))
}

#[named]
fn ftp_upload_progress_internal(
    channel: Channel,
    payload: FilePayload,
    temp_file: Option<TempFile>,
) -> Uuid {
    let mut event_producer = EventProducer::new(channel);
    let id = event_producer.id();
    let canc_token = get_cancellation_token(id);

    spawn(async move {
        let result = ftp_upload_progress_task(&mut event_producer, canc_token, payload, temp_file)
            .await
            .map(Event::FileResult);
        log_if_error_and_return!(&result);
        event_producer.send(result).await;
    });

    id
}

async fn ftp_upload_progress_task(
    event_producer: &mut EventProducer,
    canc_token: CancellationToken,
    payload: FilePayload,
    _temp_file: Option<TempFile>,
) -> Result<FileInfo> {
    // Init Phase
    event_producer.send(Ok(Event::Progress(0))).await;

    let mut ftp_stream = payload.connection.connect().await?;

    event_producer.send(Ok(Event::DeltaProgress(3))).await;

    if let Some(path) = payload.endpoint_config.path() {
        ftp_stream.cwd(path).await?;
    }

    ftp_stream.transfer_type(FileType::Binary).await?;

    event_producer.send(Ok(Event::DeltaProgress(2))).await;

    let file_info = get_file_info(&payload.local_path).await?;

    let ext = Path::new(&payload.local_path)
        .extension()
        .map_or(Cow::default(), |ext| ext.to_string_lossy());

    event_producer.send(Ok(Event::DeltaProgress(2))).await;

    // Trasfer phase: 80-88%

    // Step by 8%
    let file_iter =
        FileIter::new(payload.local_path.as_ref())?.set_mode(get_chunk::ChunkSize::Percent(10.));

    let mut writer = ftp_stream
        .put_with_stream(format!("{}.{}", payload.endpoint_config.file_name(), &ext))
        .await?
        .compat_write();

    for chunk in file_iter {
        let chunk = chunk?;
        select! {
            res = writer.write_all(&chunk) => {
                res?;
                event_producer.send(Ok(Event::DeltaProgress(8))).await;
            },
            _ = canc_token.cancelled() => {
                let _ = ftp_stream.abort(writer.into_inner()).await;
                let _ = ftp_stream.quit().await;
                return Err(Error::Aborted)
            }
        }
    }

    ftp_stream.finalize_put_stream(writer.into_inner()).await?;

    // Fin phase: 5%
    event_producer.send(Ok(Event::Progress(95))).await;
    ftp_stream.quit().await?;

    let file_info = FileInfo::new(&payload.endpoint_config, &file_info, &ext);

    event_producer.send(Ok(Event::DeltaProgress(5))).await;

    Ok(file_info)
}

#[named]
#[tauri::command]
pub async fn ftp_xml_upload(payload: XmlPayload) -> Result<FileInfo> {
    let temp_file =
        log_if_error_and_return!(write_string_to_temp_file(&payload.content, "xml").await)?;

    let file_payload = FilePayload {
        connection: payload.connection,
        local_path: temp_file.path().to_owned(),
        endpoint_config: payload.endpoint_config,
    };

    let upload_result = ftp_upload_internal(file_payload).await;
    log_if_error_and_return!(upload_result)
}

#[named]
#[tauri::command]
pub async fn ftp_upload(payload: FilePayload) -> Result<FileInfo> {
    let upload_result = ftp_upload_internal(payload).await;
    log_if_error_and_return!(upload_result)
}

async fn ftp_upload_internal(payload: FilePayload) -> Result<FileInfo> {
    let mut ftp_stream = payload.connection.connect().await?;

    if let Some(path) = payload.endpoint_config.path() {
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
        .put_file(
            &format!("{}.{}", payload.endpoint_config.file_name(), &ext),
            &mut reader,
        )
        .await?;

    ftp_stream.quit().await?;

    Ok(FileInfo::new(&payload.endpoint_config, &file_info, &ext))
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
        commands::{
            common::EndPointPayloadConf,
            ftp::{
                ftp_upload, ftp_upload_progress_internal, ftp_xml_upload,
                ftp_xml_upload_with_progress_internal, FilePayload, FtpConnection, XmlPayload,
            },
        },
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
        let payload = XmlPayload {
            connection: FtpConnection {
                host: "localhost".to_owned(),
                port,
                user: USER.to_owned(),
                password: PASSWORD.to_owned(),
            },
            content: std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                .unwrap_or_default()
                .to_owned(),
            endpoint_config: EndPointPayloadConf::new(
                "gitbar".to_owned(),
                None,
                "localhost".to_owned(),
                false,
            ),
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;

        let info_result = ftp_xml_upload(payload).await;
        assert!(info_result.is_ok());
        let file_info = info_result.unwrap();
        assert_eq!(file_info.size(), &FILESIZE);
        assert_eq!(file_info.mime_type(), "text/xml");

        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ftp_upload_err_host() {
        let port = 2122;
        let payload = XmlPayload {
            connection: FtpConnection {
                host: "localhosts".to_owned(),
                port,
                user: USER.to_owned(),
                password: PASSWORD.to_owned(),
            },
            content: std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                .unwrap_or_default()
                .to_owned(),
            endpoint_config: EndPointPayloadConf::new(
                "gitbar".to_owned(),
                None,
                "localhosts".to_owned(),
                false,
            ),
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        assert!(ftp_xml_upload(payload).await.is_err());
        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ftp_upload_err_user() {
        let port = 2123;
        let payload = XmlPayload {
            connection: FtpConnection {
                host: "localhost".to_owned(),
                port,
                user: "NotAValidUserName".to_owned(),
                password: PASSWORD.to_owned(),
            },
            content: std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                .unwrap_or_default()
                .to_owned(),
            endpoint_config: EndPointPayloadConf::new(
                "gitbar".to_owned(),
                None,
                "localhost".to_owned(),
                false,
            ),
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        assert!(ftp_xml_upload(payload).await.is_err());
        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ftp_upload_err_local_path() {
        let port = 2124;
        let payload = FilePayload {
            connection: FtpConnection {
                host: "localhost".to_owned(),
                port,
                user: USER.to_owned(),
                password: PASSWORD.to_owned(),
            },
            local_path: test_file!("gitbar.rss").to_owned(),
            endpoint_config: EndPointPayloadConf::new(
                "gitbar".to_owned(),
                None,
                "localhost".to_owned(),
                false,
            ),
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
    async fn test_ftp_xml_upload_progress_ok() {
        let port = 2125;
        let payload = XmlPayload {
            connection: FtpConnection {
                host: "localhost".to_owned(),
                port,
                user: USER.to_owned(),
                password: PASSWORD.to_owned(),
            },
            content: std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                .unwrap_or_default()
                .to_owned(),
            endpoint_config: EndPointPayloadConf::new(
                "gitbar".to_owned(),
                None,
                "localhost".to_owned(),
                false,
            ),
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;

        let (tx, mut rx) = channel(2);
        let original_id = ftp_xml_upload_with_progress_internal(tx.into(), payload)
            .await
            .unwrap();
        let mut at_least_one_progress = false;
        let mut at_least_one_result = false;

        while let Some((id, event)) = rx.recv().await {
            assert_eq!(original_id, id);
            match event {
                Ok(event) => match event {
                    crate::utils::event::Event::Progress(_) => at_least_one_progress = true,
                    crate::utils::event::Event::FileResult(file_info) => {
                        assert_eq!(file_info.size(), &FILESIZE);
                        assert_eq!(file_info.mime_type(), "text/xml");
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
        let payload = XmlPayload {
            connection: FtpConnection {
                host: "localhosts".to_owned(),
                port,
                user: USER.to_owned(),
                password: PASSWORD.to_owned(),
            },
            content: std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                .unwrap_or_default()
                .to_owned(),
            endpoint_config: EndPointPayloadConf::new(
                "gitbar".to_owned(),
                None,
                "localhosts".to_owned(),
                false,
            ),
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;

        let (tx, mut rx) = channel(2);
        let original_id = ftp_xml_upload_with_progress_internal(tx.into(), payload)
            .await
            .unwrap();
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
        let payload = XmlPayload {
            connection: FtpConnection {
                host: "localhost".to_owned(),
                port,
                user: "NotAValidUserName".to_owned(),
                password: PASSWORD.to_owned(),
            },
            content: std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                .unwrap_or_default()
                .to_owned(),
            endpoint_config: EndPointPayloadConf::new(
                "gitbar".to_owned(),
                None,
                "localhost".to_owned(),
                false,
            ),
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;

        let (tx, mut rx) = channel(2);
        let original_id = ftp_xml_upload_with_progress_internal(tx.into(), payload)
            .await
            .unwrap();
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
        let payload = FilePayload {
            connection: FtpConnection {
                host: "localhost".to_owned(),
                port,
                user: USER.to_owned(),
                password: PASSWORD.to_owned(),
            },
            local_path: test_file!("gitbar.rss").to_owned(),
            endpoint_config: EndPointPayloadConf::new(
                "gitbar".to_owned(),
                None,
                "localhost".to_owned(),
                false,
            ),
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;

        let (tx, mut rx) = channel(2);
        let original_id = ftp_upload_progress_internal(tx.into(), payload, None);
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
