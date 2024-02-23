import type { Sender, Receiver } from "@fourviere/tauri-plugin-channel-api";
import { Configuration } from "../feed/types";

export interface Upload {
  id: string;
  field: string;
  progress: number | false;
  feedId?: string;
  receiver?: Receiver;
  sender?: Sender;
  error?: string;
  value?: {
    url: string;
    mime_type: string;
    size: number;
  };
}

export interface StartUploadCommand {
  feedId: string;
  localPath: string;
  field: string;
  fileName: string;
  remote: Configuration["remotes"];
}

export interface ProgressEvent {
  Ok: {
    Progress: number;
  };
}

export interface FileResultEvent {
  Ok: {
    FileResult: {
      url: string;
      mime_type: string;
      size: number;
    };
  };
}

export interface ErrorEvent {
  Err: string;
}

export type UploadEvent = ProgressEvent | FileResultEvent | ErrorEvent;

export type Id = string;
