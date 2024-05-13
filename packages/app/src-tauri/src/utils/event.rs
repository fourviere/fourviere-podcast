use std::{
    path::PathBuf,
    sync::{
        atomic::{AtomicU8, Ordering},
        Arc,
    },
    time::Duration,
};

use serde::{Deserialize, Serialize};
use tokio::{
    spawn,
    sync::{mpsc, Notify},
};
use tokio_util::sync::CancellationToken;

use super::result::{Error, Result};

#[derive(Debug, PartialEq, Serialize)]
pub enum Event {
    DownloadProgress {
        file: String,
        progress: u8,
    },
    Working,
    DeltaProgress(u8),
    Progress(u8),
    FileResult(crate::commands::common::RemoteFileInfo),
    DiffusionImage {
        image: PathBuf,
        #[serde(with = "humantime_serde")]
        remaining_time: Duration,
    },
    TranscriptionSegment {
        text: String,
        probability_of_no_speech: f64,
        offset: f64,
        duration_secs: f64,
        #[serde(with = "humantime_serde")]
        remaining_time: Duration,
    },
}

pub type Message = Result<Event>;

pub enum Sender<T> {
    Tokio(tokio::sync::mpsc::Sender<T>),
    Channel(tauri_plugin_channel::Sender),
}

impl<T> From<tokio::sync::mpsc::Sender<T>> for Sender<T> {
    fn from(value: tokio::sync::mpsc::Sender<T>) -> Self {
        Self::Tokio(value)
    }
}

impl<T> From<tauri_plugin_channel::Sender> for Sender<T> {
    fn from(value: tauri_plugin_channel::Sender) -> Self {
        Self::Channel(value)
    }
}

impl<T: Send + Serialize + 'static> Sender<T> {
    async fn send(&mut self, message: T) -> Result<()> {
        match self {
            Sender::Tokio(sender) => sender
                .send(message)
                .await
                .map_err(|_| Error::TokioSendClosed),
            Sender::Channel(sender) => {
                sender.emit(message).await;
                Ok(())
            }
        }
    }
}

async fn run_event_dispatcher(
    mut rx: tokio::sync::mpsc::Receiver<Message>,
    mut sender: Sender<Message>,
) {
    while let Some(event) = rx.recv().await {
        let _ = sender.send(event).await;
    }
}

#[derive(Clone)]
pub struct EventProducer {
    tx: tokio::sync::mpsc::Sender<Result<Event>>,
    progress: Arc<AtomicU8>,
}

impl EventProducer {
    pub fn new<T: Into<Sender<Message>>>(sender: T) -> Self {
        let progress = Arc::new(AtomicU8::new(0));

        let (tx, rx) = mpsc::channel(100);
        let sender: Sender<Message> = sender.into();
        spawn(async move {
            run_event_dispatcher(rx, sender).await;
        });

        Self { tx, progress }
    }

    fn transform_message(&mut self, event: Message) -> Message {
        match event {
            Ok(Event::DeltaProgress(delta)) => {
                let progress = delta + self.progress.fetch_add(delta, Ordering::Relaxed);
                Ok(Event::Progress(progress))
            }
            Ok(Event::Progress(progress)) => {
                self.progress.store(progress, Ordering::Relaxed);
                event
            }
            Ok(_) => event,
            Err(_) => event,
        }
    }

    pub async fn send(&mut self, mut event: Message) {
        event = self.transform_message(event);

        let _ = self.tx.send(event).await;
    }

    pub fn blocking_send(&mut self, mut event: Message) {
        event = self.transform_message(event);

        let _ = self.tx.blocking_send(event);
    }
}

#[derive(Debug, PartialEq, Deserialize)]
pub enum Command {
    Start,
    Abort,
}

pub enum Receiver<T> {
    Tokio(tokio::sync::mpsc::Receiver<T>),
    Channel(tauri_plugin_channel::Receiver),
}

impl<T> From<tokio::sync::mpsc::Receiver<T>> for Receiver<T> {
    fn from(value: tokio::sync::mpsc::Receiver<T>) -> Self {
        Self::Tokio(value)
    }
}

impl<T> From<tauri_plugin_channel::Receiver> for Receiver<T> {
    fn from(value: tauri_plugin_channel::Receiver) -> Self {
        Self::Channel(value)
    }
}

async fn run_abort_listener(
    mut rx: Receiver<Command>,
    canc_token: CancellationToken,
    start_token: Arc<Notify>,
) {
    loop {
        let data = match &mut rx {
            Receiver::Tokio(rec) => rec.recv().await,
            Receiver::Channel(rec) => rec.once().await,
        };

        match data {
            Some(Command::Abort) => {
                canc_token.cancel();
                break;
            }
            Some(Command::Start) => start_token.notify_one(),
            None => (),
        }
    }
}

pub struct CommandReceiver {
    start_token: Arc<Notify>,
    canc_token: CancellationToken,
}

impl CommandReceiver {
    pub fn new<T: Into<Receiver<Command>>>(rx: T) -> Self {
        let canc_token_listener = CancellationToken::new();
        let canc_token = canc_token_listener.clone();
        let start_token = Arc::new(Notify::new());
        let start_token_listener = start_token.clone();
        let rx: Receiver<Command> = rx.into();
        spawn(async move {
            run_abort_listener(rx, canc_token_listener, start_token_listener).await;
        });

        CommandReceiver {
            canc_token,
            start_token,
        }
    }

    pub async fn cancelled(&self) {
        self.canc_token.cancelled().await
    }

    pub async fn started(&self) {
        self.start_token.notified().await;
    }
}

impl From<CommandReceiver> for tokio_util::sync::CancellationToken {
    fn from(value: CommandReceiver) -> Self {
        value.canc_token
    }
}

#[cfg(test)]
mod test {
    use tokio::{spawn, sync::mpsc::channel};

    use crate::utils::event::{Command, CommandReceiver, Event, EventProducer, Message};

    #[tokio::test(flavor = "multi_thread")]
    async fn test_event_ok() {
        let (tx, mut rx) = channel::<Message>(2);
        let mut event_producer = EventProducer::new(tx);

        spawn(async move {
            event_producer.send(Ok(Event::Progress(0))).await;
            event_producer.send(Ok(Event::DeltaProgress(5))).await;
            event_producer.send(Ok(Event::DeltaProgress(2))).await;
            event_producer.send(Ok(Event::Progress(5))).await;
        });

        match rx.recv().await {
            Some(message) => {
                assert!(message.is_ok());
                assert_eq!(message.unwrap(), Event::Progress(0));
            }
            None => panic!("Tx closed"),
        }

        match rx.recv().await {
            Some(message) => {
                assert!(message.is_ok());
                assert_eq!(message.unwrap(), Event::Progress(5));
            }
            None => panic!("Tx closed"),
        }

        match rx.recv().await {
            Some(message) => {
                assert!(message.is_ok());
                assert_eq!(message.unwrap(), Event::Progress(7));
            }
            None => panic!("Tx closed"),
        }

        match rx.recv().await {
            Some(message) => {
                assert!(message.is_ok());
                assert_eq!(message.unwrap(), Event::Progress(5));
            }
            None => panic!("Tx closed"),
        }
    }

    #[tokio::test(flavor = "multi_thread")]
    async fn test_canc_token_ok() {
        let (tx, rx) = channel(2);
        let canc_token = CommandReceiver::new(rx);
        spawn(async move {
            let _ = tx.send(Command::Abort).await;
        });
        canc_token.cancelled().await;
    }
}
