use std::{collections::HashMap, sync::OnceLock};

use tauri::{AppHandle, Manager, Window};
use tokio::{
    spawn,
    sync::mpsc::{self, Receiver, Sender},
};
use uuid::Uuid;

use super::result::{Error, Result};

static EVENT_SENDER: OnceLock<EventSender> = OnceLock::new();

#[derive(Clone, serde::Serialize)]
pub enum Event {
    Progress(u8),
}

pub type Message = (Uuid, Result<Event>);
type JoinEvent = (Uuid, Channel);
type LeaveEvent = Uuid;

enum ProducerEvent {
    Send(Message),
    Join(JoinEvent),
    Leave(LeaveEvent),
}

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
            Channel::Sender(sender) => sender.send((id, event)).await.map_err(|_| Error::TokioSend),
        }
    }
}

struct EventSender {
    tx: Sender<ProducerEvent>,
}

impl EventSender {
    fn join(&self, id: Uuid, channel: Channel) -> Option<Sender<ProducerEvent>> {
        let tx = self.tx.clone();
        tx.blocking_send(ProducerEvent::Join((id, channel)))
            .ok()
            .map(|_| tx)
    }

    fn leave(id: Uuid, tx: &Sender<ProducerEvent>) {
        let _ = tx.blocking_send(ProducerEvent::Leave(id));
    }

    async fn run(mut rx: Receiver<ProducerEvent>) {
        let mut producer_map: HashMap<Uuid, Channel> = HashMap::new();
        while let Some(event) = rx.recv().await {
            match event {
                ProducerEvent::Send(message) => {
                    if let Some(channel) = producer_map.get_mut(&message.0) {
                        let _ = channel.send(message).await;
                    }
                }
                ProducerEvent::Join((id, channel)) => {
                    let _ = producer_map.insert(id, channel);
                }
                ProducerEvent::Leave(id) => {
                    let _ = producer_map.remove(&id);
                }
            }
        }
    }

    fn new() -> Self {
        let (tx, rx) = mpsc::channel(100);
        spawn(async move {
            EventSender::run(rx).await;
        });

        EventSender { tx }
    }
}

pub struct EventProducer {
    id: Uuid,
    tx: Sender<ProducerEvent>,
}

impl EventProducer {
    pub fn new(channel: Channel) -> Option<Self> {
        let sender = EVENT_SENDER.get_or_init(EventSender::new);

        let id = Uuid::new_v4();
        sender.join(id, channel).map(|tx| Self { id, tx })
    }

    pub async fn send(&mut self, event: Result<Event>) {
        let _ = self.tx.send(ProducerEvent::Send((self.id, event))).await;
    }

    pub fn id(&self) -> Uuid {
        self.id
    }
}

impl Drop for EventProducer {
    fn drop(&mut self) {
        EventSender::leave(self.id, &self.tx);
    }
}
