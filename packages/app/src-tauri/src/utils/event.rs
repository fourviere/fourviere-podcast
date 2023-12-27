use std::sync::{
    atomic::{AtomicU8, Ordering},
    Arc,
};

use serde::Serialize;
use tauri::{AppHandle, Manager, Window};
use tokio::{
    spawn,
    sync::mpsc::{self, Receiver, Sender},
};
use uuid::Uuid;

use super::result::{Error, Result};

#[derive(Debug, PartialEq, Serialize)]
pub enum Event {
    DeltaProgress(u8),
    Progress(u8),
    FileResult(crate::commands::common::FileInfo),
}

type Message = (Uuid, Result<Event>);

pub enum Channel {
    Global(AppHandle),
    Window(Window),
    Sender(Sender<Message>),
}

impl From<AppHandle> for Channel {
    fn from(value: AppHandle) -> Self {
        Channel::Global(value)
    }
}

impl From<Window> for Channel {
    fn from(value: Window) -> Self {
        Channel::Window(value)
    }
}

impl From<Sender<Message>> for Channel {
    fn from(value: Sender<Message>) -> Self {
        Channel::Sender(value)
    }
}

impl Channel {
    async fn send(&mut self, message: Message) -> Result<()> {
        let (id, event) = message;
        match self {
            Channel::Global(app) => app
                .emit_all(&id.to_string(), &event)
                .map_err(|err| err.into()),
            Channel::Window(window) => window
                .emit(&id.to_string(), &event)
                .map_err(|err| err.into()),
            Channel::Sender(sender) => sender
                .send((id, event))
                .await
                .map_err(|_| Error::TokioSendClosed),
        }
    }
}

async fn run_event_dispatcher(mut rx: Receiver<Result<Event>>, id: Uuid, mut channel: Channel) {
    while let Some(event) = rx.recv().await {
        let _ = channel.send((id, event)).await;
    }
}
#[derive(Clone)]
pub struct EventProducer {
    id: Uuid,
    tx: Sender<Result<Event>>,
    progress: Arc<AtomicU8>,
}

impl EventProducer {
    pub fn new(channel: Channel) -> Self {
        let id = Uuid::now_v7();
        let progress = Arc::new(AtomicU8::new(0));

        let (tx, rx) = mpsc::channel(100);
        spawn(async move {
            run_event_dispatcher(rx, id, channel).await;
        });

        Self { id, tx, progress }
    }

    pub async fn send(&mut self, mut event: Result<Event>) {
        event = match event {
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
        };

        let _ = self.tx.send(event).await;
    }

    pub fn id(&self) -> Uuid {
        self.id
    }
}

#[cfg(test)]
mod test {
    use tokio::{spawn, sync::mpsc::channel};

    use crate::utils::event::{Event, EventProducer};

    #[tokio::test(flavor = "multi_thread")]
    async fn test_event_ok() {
        let (tx, mut rx) = channel(2);
        let mut event_producer = EventProducer::new(tx.into());
        let original_id = event_producer.id();

        spawn(async move {
            event_producer.send(Ok(Event::Progress(0))).await;
            event_producer.send(Ok(Event::DeltaProgress(5))).await;
            event_producer.send(Ok(Event::DeltaProgress(2))).await;
            event_producer.send(Ok(Event::Progress(5))).await;
        });

        match rx.recv().await {
            Some((id, message)) => {
                assert_eq!(original_id, id);
                assert!(message.is_ok());
                assert_eq!(message.unwrap(), Event::Progress(0));
            }
            None => panic!("Tx closed"),
        }

        match rx.recv().await {
            Some((id, message)) => {
                assert_eq!(original_id, id);
                assert!(message.is_ok());
                assert_eq!(message.unwrap(), Event::Progress(5));
            }
            None => panic!("Tx closed"),
        }

        match rx.recv().await {
            Some((id, message)) => {
                assert_eq!(original_id, id);
                assert!(message.is_ok());
                assert_eq!(message.unwrap(), Event::Progress(7));
            }
            None => panic!("Tx closed"),
        }

        match rx.recv().await {
            Some((id, message)) => {
                assert_eq!(original_id, id);
                assert!(message.is_ok());
                assert_eq!(message.unwrap(), Event::Progress(5));
            }
            None => panic!("Tx closed"),
        }
    }
}
