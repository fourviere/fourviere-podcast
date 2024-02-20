import { Configuration } from "../feed/types";

export interface Upload {
  id: string;
  field: string;
  progress: number | false;
  feedId?: string;
  eventStreamId?: string;
  unlisten?: () => void;
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
