use ::function_name::named;
use get_chunk::iterator::FileIter;
use serde::Deserialize;
use std::str;
use suppaftp::{types::FileType, AsyncFtpStream, Mode};
use tauri::Window;
use tokio::{io::AsyncWriteExt, select, spawn, sync::mpsc::channel};
use tokio_util::{compat::FuturesAsyncWriteCompatExt, sync::CancellationToken};
use uuid::Uuid;

use crate::{
    commands::common::get_cancellation_token,
    log_if_error_and_return,
    utils::{
        event::{Channel, Event, EventProducer},
        result::{Error, Result},
    },
};

use super::common::{RemoteFileInfo, Uploadable};

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
pub struct UploadableConf {
    #[serde(flatten)]
    connection: FtpConnection,

    #[serde(flatten)]
    uploadable: Uploadable,
}

#[tauri::command]
pub async fn ftp_upload_window_progress(window: Window, uploadable: UploadableConf) -> Uuid {
    ftp_upload_progress_internal(window.into(), uploadable)
}

#[named]
fn ftp_upload_progress_internal(channel: Channel, uploadable: UploadableConf) -> Uuid {
    let mut event_producer = EventProducer::new(channel);
    let id = event_producer.id();
    let canc_token = get_cancellation_token(id);

    spawn(async move {
        let result = ftp_upload_progress_task(&mut event_producer, canc_token, uploadable)
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
    mut uploadable_conf: UploadableConf,
) -> Result<RemoteFileInfo> {
    // Init Phase
    event_producer.send(Ok(Event::Progress(0))).await;

    let mut ftp_stream = uploadable_conf.connection.connect().await?;

    event_producer.send(Ok(Event::DeltaProgress(3))).await;

    if let Some(path) = uploadable_conf.uploadable.remote_config().path() {
        ftp_stream.cwd(path).await?;
    }

    ftp_stream.transfer_type(FileType::Binary).await?;

    event_producer.send(Ok(Event::DeltaProgress(2))).await;

    let local_path = uploadable_conf
        .uploadable
        .local_path()
        .await?
        .into_os_string()
        .into_string()
        .map_err(|_| Error::LocalPathConversion)?;

    let new_file_name = uploadable_conf.uploadable.remote_file_name();

    event_producer.send(Ok(Event::DeltaProgress(2))).await;

    // Trasfer phase: 80-88%

    // Step by 8%
    let file_iter = FileIter::new(local_path)?.set_mode(get_chunk::ChunkSize::Percent(10.));

    let mut writer = ftp_stream
        .put_with_stream(new_file_name)
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

    let file_info = uploadable_conf.uploadable.remote_file_info()?;

    event_producer.send(Ok(Event::DeltaProgress(5))).await;

    Ok(file_info)
}

#[named]
#[tauri::command]
pub async fn ftp_upload(uploadable_conf: UploadableConf) -> Result<RemoteFileInfo> {
    let upload_result = ftp_upload_internal(uploadable_conf).await;
    log_if_error_and_return!(upload_result)
}

async fn ftp_upload_internal(uploadable_conf: UploadableConf) -> Result<RemoteFileInfo> {
    let (tx, mut rx) = channel(20);
    let _ = ftp_upload_progress_internal(tx.into(), uploadable_conf);
    while let Some(data) = rx.recv().await {
        match data {
            (_, Ok(Event::Progress(_))) => (),
            (_, Ok(Event::DeltaProgress(_))) => (),
            (_, Ok(Event::FileResult(res))) => return Ok(res),
            (_, Err(err)) => return Err(err),
        }
    }
    Err(Error::Aborted)
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
            common::{RemoteUploadableConf, Uploadable},
            ftp::{ftp_upload, ftp_upload_progress_internal, FtpConnection, UploadableConf},
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
        let uploadable_conf = UploadableConf {
            connection: FtpConnection {
                host: "localhost".to_owned(),
                port,
                user: USER.to_owned(),
                password: PASSWORD.to_owned(),
            },
            uploadable: Uploadable::new(
                None,
                Some(include_bytes!(test_file!("gitbar.xml")).to_vec()),
                RemoteUploadableConf::new("gitbar".to_owned(), None, "localhost".to_owned(), false),
            ),
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;

        let info_result = ftp_upload(uploadable_conf).await;
        assert!(info_result.is_ok());
        let file_info = info_result.unwrap();
        assert_eq!(file_info.size(), &FILESIZE);
        assert_eq!(file_info.mime_type(), "application/octet-stream");

        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ftp_upload_err_host() {
        let port = 2122;
        let uploadable_conf = UploadableConf {
            connection: FtpConnection {
                host: "localhosts".to_owned(),
                port,
                user: USER.to_owned(),
                password: PASSWORD.to_owned(),
            },
            uploadable: Uploadable::new(
                None,
                Some(include_bytes!(test_file!("gitbar.xml")).to_vec()),
                RemoteUploadableConf::new(
                    "gitbar".to_owned(),
                    None,
                    "localhosts".to_owned(),
                    false,
                ),
            ),
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        assert!(ftp_upload(uploadable_conf).await.is_err());
        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ftp_upload_err_user() {
        let port = 2123;
        let uploadable_conf = UploadableConf {
            connection: FtpConnection {
                host: "localhost".to_owned(),
                port,
                user: "NotAValidUserName".to_owned(),
                password: PASSWORD.to_owned(),
            },
            uploadable: Uploadable::new(
                None,
                Some(include_bytes!(test_file!("gitbar.xml")).to_vec()),
                RemoteUploadableConf::new("gitbar".to_owned(), None, "localhost".to_owned(), false),
            ),
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        assert!(ftp_upload(uploadable_conf).await.is_err());
        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ftp_upload_err_local_path() {
        let port = 2124;
        let uploadable_conf = UploadableConf {
            connection: FtpConnection {
                host: "localhost".to_owned(),
                port,
                user: USER.to_owned(),
                password: PASSWORD.to_owned(),
            },
            uploadable: Uploadable::new(
                Some(test_file!("gitbar.rss").into()),
                None,
                RemoteUploadableConf::new("gitbar".to_owned(), None, "localhost".to_owned(), false),
            ),
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;
        assert!(ftp_upload(uploadable_conf).await.is_err());
        handle.abort();
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_ftp_xml_upload_progress_ok() {
        let port = 2125;
        let uploadable_conf = UploadableConf {
            connection: FtpConnection {
                host: "localhost".to_owned(),
                port,
                user: USER.to_owned(),
                password: PASSWORD.to_owned(),
            },
            uploadable: Uploadable::new(
                Some(test_file!("gitbar.xml").into()),
                None,
                RemoteUploadableConf::new("gitbar".to_owned(), None, "localhost".to_owned(), false),
            ),
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;

        let (tx, mut rx) = channel(2);
        let original_id = ftp_upload_progress_internal(tx.into(), uploadable_conf);

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

        let uploadable_conf = UploadableConf {
            connection: FtpConnection {
                host: "localhosts".to_owned(),
                port,
                user: USER.to_owned(),
                password: PASSWORD.to_owned(),
            },
            uploadable: Uploadable::new(
                None,
                Some(include_bytes!(test_file!("gitbar.xml")).to_vec()),
                RemoteUploadableConf::new(
                    "gitbar".to_owned(),
                    None,
                    "localhosts".to_owned(),
                    false,
                ),
            ),
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;

        let (tx, mut rx) = channel(2);
        let original_id = ftp_upload_progress_internal(tx.into(), uploadable_conf);
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
        let uploadable_conf = UploadableConf {
            connection: FtpConnection {
                host: "localhost".to_owned(),
                port,
                user: "NotAValidUserName".to_owned(),
                password: PASSWORD.to_owned(),
            },
            uploadable: Uploadable::new(
                None,
                Some(include_bytes!(test_file!("gitbar.xml")).to_vec()),
                RemoteUploadableConf::new("gitbar".to_owned(), None, "localhost".to_owned(), false),
            ),
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;

        let (tx, mut rx) = channel(2);
        let original_id = ftp_upload_progress_internal(tx.into(), uploadable_conf);

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

        let uploadable_conf = UploadableConf {
            connection: FtpConnection {
                host: "localhost".to_owned(),
                port,
                user: USER.to_owned(),
                password: PASSWORD.to_owned(),
            },
            uploadable: Uploadable::new(
                Some(test_file!("gitbar.rss").into()),
                None,
                RemoteUploadableConf::new("gitbar".to_owned(), None, "localhost".to_owned(), false),
            ),
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;

        let (tx, mut rx) = channel(2);
        let original_id = ftp_upload_progress_internal(tx.into(), uploadable_conf);
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
