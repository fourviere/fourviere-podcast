import { Feed } from "@fourviere/core/lib/schema/feed";

export interface Configuration {
  feed: {
    filename: string;
  };
  meta: {
    lastFeedUpdate: Date;
    feedIsDirty: boolean;
  };
  remotes: {
    remote: "s3" | "ftp" | "none";
    s3?: {
      endpoint: string;
      region: string;
      bucket_name: string;
      access_key: string;
      secret_key: string;
      http_host: string;
      https: boolean;
      path: string;
    };
    ftp?: {
      host: string;
      port: number;
      user: string;
      password: string;
      path: string | null;
      http_host: string;
      https: boolean;
    };
  };
}

export interface Project {
  feed: Feed;
  configuration: Configuration;
}
