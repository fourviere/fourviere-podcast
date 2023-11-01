import { create } from "zustand";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";
import { Feed } from "@fourviere/core/lib/schema/feed";
import { loadState, persistState } from "./persister";

interface Configuration {
  storage: (FTPStorage | S3Storage | LocalStorage) & {
    type: "ftp" | "s3" | "local";
  };
}

interface FTPStorage {
  host: string;
  port: number;
  username: string;
  password: string;
  path: string;
}
interface S3Storage {
  bucket: string;
  accessKey: string;
  secretKey: string;
  path: string;
}
interface LocalStorage {
  path: string;
}

export interface Project {
  feed: Feed;
  configuration?: Configuration;
}
export interface FeedState {
  projects: Record<string, Project>;
  currentProject?: string;
}

const feedStore = create<FeedState>((set, _get) => {
  return {
    projects: {},
    currentProject: undefined,

    loadFeedFromUrl: async (feedUrl: string) => {
      const response = await fetch(feedUrl);
      const feed = await response.json();
      set((state: FeedState) => {
        return produce(state, (draft) => {
          draft.projects[feedUrl] = { feed };
          draft.currentProject = feedUrl;
        });
      });
    },

    loadFeedFromData: (feed: Feed) => {
      set((state: FeedState) => {
        return produce(state, (draft) => {
          draft.projects[uuidv4()] = { feed };
          draft.currentProject = uuidv4();
        });
      });
    },
  };
});

loadState().then((state) => {
  if (state) {
    feedStore.setState(state);
  }
});

feedStore.subscribe(async (state) => {
  await persistState(state);
});

export default feedStore;
