use ::function_name::named;
use get_chunk::{
    data_size_format::si::{SISize, SIUnit},
    stream::{FileStream, StreamExt},
};
use serde::Deserialize;
use std::str;
use suppaftp::{types::FileType, AsyncFtpStream, Mode};
use tauri::AppHandle;
use tauri_plugin_channel::Channel;
use tokio::{io::AsyncWriteExt, select, spawn};
use tokio_util::compat::FuturesAsyncWriteCompatExt;

use crate::{
    log_if_error_and_return,
    utils::{
        event::{Command, CommandReceiver, Event, EventProducer},
        result::{Error, Result},
    },
};

use super::common::{build_channel, build_local_channel, RemoteFileInfo, Uploadable};

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
            .is_ok_and(|opts| opts.contains_key("EPSV"))
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
pub async fn ftp_upload_progress(
    app_handle: AppHandle,
    uploadable_conf: UploadableConf,
) -> Channel {
    let (producer, receiver, channel) = build_channel(app_handle);
    ftp_upload_progress_internal(producer, receiver, uploadable_conf);
    channel
}

#[named]
fn ftp_upload_progress_internal(
    mut producer: EventProducer,
    receiver: CommandReceiver,
    uploadable_conf: UploadableConf,
) {
    spawn(async move {
        let result = ftp_upload_progress_task(&mut producer, receiver, uploadable_conf)
            .await
            .map(Event::FileResult);
        log_if_error_and_return!(&result);
        producer.send(result).await;
    });
}

async fn ftp_upload_progress_task(
    event_producer: &mut EventProducer,
    receiver: CommandReceiver,
    mut uploadable_conf: UploadableConf,
) -> Result<RemoteFileInfo> {
    let _ = receiver.started().await;

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

    let filename = uploadable_conf.uploadable.remote_filename();

    event_producer.send(Ok(Event::DeltaProgress(2))).await;

    // Trasfer phase: 80-88%

    let min_chunck_size = SIUnit::new(6., SISize::Megabyte);
    let mut file_stream = FileStream::new(local_path)
        .await?
        .set_mode(get_chunk::ChunkSize::Bytes(min_chunck_size.into()));

    let mut writer = ftp_stream.put_with_stream(filename).await?.compat_write();

    let chunk_number = <SIUnit as Into<f64>>::into(
        SIUnit::auto(file_stream.get_file_size()) / min_chunck_size.into(),
    )
    .ceil() as u16;
    let delta_progress = 80 / (chunk_number) as u8;

    while let Ok(Some(chunk)) = file_stream.try_next().await {
        select! {
            res = writer.write_all(&chunk) => {
                res?;
                event_producer.send(Ok(Event::DeltaProgress(delta_progress))).await;
            },
            _ = receiver.cancelled() => {
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
    let (producer, receiver, mut rx_event, tx_command) = build_local_channel();
    ftp_upload_progress_internal(producer, receiver, uploadable_conf);
    let _ = tx_command.send(Command::Start).await;

    while let Some(data) = rx_event.recv().await {
        match data {
            Ok(Event::FileResult(res)) => return Ok(res),
            Ok(_) => (),
            Err(err) => return Err(err),
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
    use tokio::{spawn, time::sleep};

    use crate::{
        commands::{
            common::{build_local_channel, RemoteUploadableConf, Uploadable},
            ftp::{ftp_upload, ftp_upload_progress_internal, FtpConnection, UploadableConf},
        },
        test_file,
        utils::event::Command,
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
                std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                    .ok()
                    .map(|val| val.to_owned()),
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
                std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                    .ok()
                    .map(|val| val.to_owned()),
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
                std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                    .ok()
                    .map(|val| val.to_owned()),
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

        let (producer, receiver, mut rx_event, tx_command) = build_local_channel();
        let _ = tx_command.send(Command::Start).await;
        ftp_upload_progress_internal(producer, receiver, uploadable_conf);

        let mut at_least_one_progress = false;
        let mut at_least_one_result = false;

        while let Some(event) = rx_event.recv().await {
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
                std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                    .ok()
                    .map(|val| val.to_owned()),
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

        let (producer, receiver, mut rx_event, tx_command) = build_local_channel();
        let _ = tx_command.send(Command::Start).await;
        ftp_upload_progress_internal(producer, receiver, uploadable_conf);

        let mut at_least_one_error = false;

        while let Some(event) = rx_event.recv().await {
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
                std::str::from_utf8(include_bytes!(test_file!("gitbar.xml")))
                    .ok()
                    .map(|val| val.to_owned()),
                RemoteUploadableConf::new("gitbar".to_owned(), None, "localhost".to_owned(), false),
            ),
        };

        let handle = spawn(async move {
            assert!(ftp_server(port).await.is_ok());
        });

        // Hopefully the server is up =D
        sleep(Duration::from_secs(2)).await;

        let (producer, receiver, mut rx_event, tx_command) = build_local_channel();
        let _ = tx_command.send(Command::Start).await;
        ftp_upload_progress_internal(producer, receiver, uploadable_conf);

        let mut at_least_one_error = false;

        while let Some(event) = rx_event.recv().await {
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

        let (producer, receiver, mut rx_event, tx_command) = build_local_channel();
        let _ = tx_command.send(Command::Start).await;
        ftp_upload_progress_internal(producer, receiver, uploadable_conf);

        let mut at_least_one_error = false;

        while let Some(event) = rx_event.recv().await {
            match event {
                Ok(_) => (),
                Err(_) => at_least_one_error = true,
            }
        }

        assert!(at_least_one_error);

        handle.abort();
    }
}
