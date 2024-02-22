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
        command: "s3_upload_progress",
        uploadableConf: {
          local_path: startUploadCommand.localPath,
          file_name: startUploadCommand.fileName,
          ...startUploadCommand.remote.s3,
        },
      };
    case "ftp":
      return {
        command: "ftp_upload_progress",
        uploadableConf: {
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
  event: UploadEvent,
): event is ProgressEvent {
  return (
    event &&
    "Ok" in event &&
    "Progress" in event.Ok &&
    event.Ok.Progress !== undefined
  );
}

export function isFileResultEvent(
  event: UploadEvent,
): event is FileResultEvent {
  return (
    event &&
    "Ok" in event &&
    "FileResult" in event.Ok &&
    event.Ok.FileResult !== undefined
  );
}

export function isErrorEvent(
  event: UploadEvent,
): event is ErrorEvent {
  return (
    event &&
    "Err" in event &&
    event.Err !== undefined
  );
}
