import { create } from "zustand";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";
import { Feed } from "@fourviere/core/lib/schema/feed";
import { loadState, persistState } from "./persister";
import { parseXML } from "@fourviere/core/lib/converter";
import { FEED_TEMPLATE } from "@fourviere/core/lib/const";
import { fetchFeed } from "../native/network";

interface Configuration {
  remotes: {
    remote: "s3" | "ftp" | "none";
    s3?: {
      bucket_name: string;
      region: string;
      endpoint: string;
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
  configuration?: Configuration;
}
export interface FeedState {
  projects: Record<string, Project>;
  createProject: () => void;
  getProjectById: (id: string) => Project;
  updateFeed: (id: string, feed: Project["feed"]) => void;
  loadFeedFromUrl: (feedUrl: string) => void;
  loadFeedFromFileContents: (feed: string) => void;
}

const feedStore = create<FeedState>((set, _get) => {
  return {
    projects: {},
    getProjectById: (id) => {
      return _get().projects[id];
    },
    createProject: async () => {
      const feed = await parseXML(FEED_TEMPLATE);
      set((state: FeedState) => {
        return produce(state, (draft) => {
          const id = uuidv4();
          draft.projects[id] = {
            feed,
            configuration: {
              remotes: {
                remote: "none",
              },
            },
          };
        });
      });
    },

    loadFeedFromUrl: async (feedUrl) => {
      const data = await fetchFeed(feedUrl);
      if (!data) return;
      const feed = await parseXML(data);
      set((state: FeedState) => {
        return produce(state, (draft) => {
          const id = uuidv4();
          draft.projects[id] = { feed };
        });
      });
    },

    loadFeedFromFileContents: async (fileContents) => {
      const feed = await parseXML(fileContents);
      set((state: FeedState) => {
        return produce(state, (draft) => {
          const id = uuidv4();
          draft.projects[id] = { feed };
        });
      });
    },

    updateFeed: (id: string, feed: Project["feed"]) => {
      set((state: FeedState) => {
        return produce(state, (draft) => {
          draft.projects[id].feed = feed;
        });
      });
    },
  };
});

loadState<FeedState>("feeds").then((state) => {
  if (state) {
    feedStore.setState(state);
  }
});

feedStore.subscribe(async (state) => {
  persistState("feeds", state);
});

export default feedStore;
