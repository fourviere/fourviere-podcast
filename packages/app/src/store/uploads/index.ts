import { create } from "zustand";
import { channel } from "tauri-plugin-channel-api";
import { produce } from "immer";
import { Id, StartUploadCommand, Upload, UploadEvent } from "./types";
import {
  generateId,
  getTauriUploadCommandByRemote,
  isErrorEvent,
  isFileResultEvent,
  isProgressEvent,
} from "./utils";

export interface UploadsStore {
  uploads: Record<Id, Upload>;
  startUpload: (upload: StartUploadCommand) => Promise<void>;
  abortUpload: (upload: Id) => Promise<void>;
  removeUpload: (upload: Id) => void;
}

const uploadsStore = create<UploadsStore>((set) => ({
  uploads: {},
  startUpload: async (upload) => {
    const { command, uploadableConf } = getTauriUploadCommandByRemote(upload);

    if (!command) {
      // if remote is not configured or equals to none we don't start the upload
      return;
    }

    const id = generateId(upload.feedId, upload.field);

    const [sender, receiver] = await channel(command, { uploadableConf });

    await receiver.listen<UploadEvent>((event) => {
      console.log(event)
      if (isProgressEvent(event)) {
        set((state) => {
          return produce(state, (draft) => {
            draft.uploads[id].progress = event.Ok.Progress;
          });
        });
      }

      if (isFileResultEvent(event)) {
        set((state) => {
          return produce(state, (draft) => {
            draft.uploads[id].progress = false;
            draft.uploads[id].value = event.Ok.FileResult;
            draft.uploads[id].feedId = upload.feedId;
            delete draft.uploads[id].receiver;
            delete draft.uploads[id].sender;
          });
        });
      }

      if (isErrorEvent(event)) {
        // improve error management
        console.error("error scope", event.Err);

        set((state) => {
          return produce(state, (draft) => {
            if (draft.uploads[id]) {
              draft.uploads[id].error = event.Err;
              draft.uploads[id].progress = false;
            }
          });
        });
      }
    });

    await sender.emit("Start");

    set((state) => ({
      uploads: {
        ...state.uploads,
        [id]: {
          id,
          field: upload.field,
          progress: 0,
          receiver,
          sender
        },
      },
    }));
  },
  abortUpload: async (uploadId) => {
    const upload = uploadsStore.getState().uploads[uploadId];

    if (!upload) {
      return;
    }

    if (!upload.sender) {
      return;
    }

    await upload.sender.emit("Abort");

    set((state) => {
      return produce(state, (draft) => {
        delete draft.uploads[uploadId];
      });
    });
  },
  removeUpload: (uploadId) => {
    set((state) => {
      return produce(state, (draft) => {
        delete draft.uploads[uploadId];
      });
    });
  },
}));

export default uploadsStore;

uploadsStore.subscribe((state) => {
  console.log("feedStore change", state);
});
