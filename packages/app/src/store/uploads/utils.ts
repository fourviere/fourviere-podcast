import { Event } from "@tauri-apps/api/event";
import {
  ErrorEvent,
  FileResultEvent,
  ProgressEvent,
  StartUploadCommand,
  UploadEvent,
} from "./types";

export function getTauriUploadCommandByRemote(
  startUploadCommand: StartUploadCommand,
) {
  switch (startUploadCommand.remote.remote) {
    case "s3":
      return {
        command: "s3_upload_window_progress",
        payload: {
          local_path: startUploadCommand.localPath,
          file_name: startUploadCommand.fileName,
          ...startUploadCommand.remote.s3,
        },
      };
    case "ftp":
      return {
        command: "ftp_upload_window_progress",
        payload: {
          local_path: startUploadCommand.localPath,
          file_name: startUploadCommand.fileName,
          ...startUploadCommand.remote.ftp,
        },
      };
    default:
      return {
        command: undefined,
        payload: undefined,
      };
  }
}

export function generateId(feedId: string, field: string) {
  return `${feedId}-${field}`;
}

export function isProgressEvent(
  event: Event<UploadEvent>,
): event is Event<ProgressEvent> {
  return (
    event &&
    event.payload &&
    "Ok" in event.payload &&
    "Progress" in event.payload.Ok &&
    event.payload.Ok.Progress !== undefined
  );
}

export function isFileResultEvent(
  event: Event<UploadEvent>,
): event is Event<FileResultEvent> {
  return (
    event &&
    event.payload &&
    "Ok" in event.payload &&
    "FileResult" in event.payload.Ok &&
    event.payload.Ok.FileResult !== undefined
  );
}

export function isErrorEvent(
  event: Event<UploadEvent>,
): event is Event<ErrorEvent> {
  return (
    event &&
    event.payload &&
    "Err" in event.payload &&
    event.payload.Err !== undefined
  );
}
