import { create } from "zustand";
import { invoke } from "@tauri-apps/api";
import { listen } from "@tauri-apps/api/event";
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
    const { command, payload } = getTauriUploadCommandByRemote(upload);

    if (!command) {
      // if remote is not configured or equals to none we don't start the upload
      return;
    }

    const id = generateId(upload.feedId, upload.field);

    const eventStreamId = await invoke<string>(command, { payload });

    const unlisten = await listen<UploadEvent>(eventStreamId, function (event) {
      if (isProgressEvent(event)) {
        set((state) => {
          return produce(state, (draft) => {
            draft.uploads[id].progress = event.payload.Ok.Progress;
          });
        });
      }

      if (isFileResultEvent(event)) {
        set((state) => {
          return produce(state, (draft) => {
            draft.uploads[id].progress = false;
            draft.uploads[id].value = event.payload.Ok.FileResult;
            draft.uploads[id].feedId = upload.feedId;
            delete draft.uploads[id].unlisten;
          });
        });

        unlisten();
      }

      if (isErrorEvent(event)) {
        // improve error management
        console.error("error scope", event.payload.Err);

        unlisten();
        set((state) => {
          return produce(state, (draft) => {
            if (draft.uploads[id]) {
              draft.uploads[id].error = event.payload.Err;
              draft.uploads[id].progress = false;
            }
          });
        });
      }
    });

    set((state) => ({
      uploads: {
        ...state.uploads,
        [id]: {
          id,
          eventStreamId,
          field: upload.field,
          // initialize progress to 7 to avoid the progress bar to be hidden
          progress: 7,
          unlisten,
        },
      },
    }));
  },
  abortUpload: async (uploadId) => {
    const upload = uploadsStore.getState().uploads[uploadId];

    if (!upload) {
      return;
    }

    if (!upload.eventStreamId) {
      return;
    }

    await invoke("abort_progress_task", {
      uuid: upload.eventStreamId,
    });

    upload.unlisten?.();

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
