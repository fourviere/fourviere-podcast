import { create } from "zustand";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";
import { Feed } from "@fourviere/core/lib/schema/feed";
import { loadState, persistState } from "./persister";
import { parseXML } from "@fourviere/core/lib/converter";
import { FEED_TEMPLATE } from "@fourviere/core/lib/const";
import { fetchFeed } from "../native/network";

export interface Configuration {
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
export interface FeedState {
  projects: Record<string, Project>;
  createProject: () => void;
  getProjectById: (id: string) => Project;
  updateFeed: (id: string, feed: Project["feed"]) => void;
  updateConfiguration: (
    id: string,
    configuration: Project["configuration"],
  ) => void;
  loadFeedFromUrl: (feedUrl: string) => Promise<void>;
  loadFeedFromFileContents: (feed: string) => void;
}

const BASE_CONFIGURATION: Configuration = {
  remotes: {
    remote: "none",
  },
};

const feedStore = create<FeedState>((set, _get) => {
  return {
    projects: {},
    getProjectById: (id) => {
      return _get().projects[id];
    },
    createProject: () => {
      const feed = parseXML(FEED_TEMPLATE);
      set((state: FeedState) => {
        return produce(state, (draft) => {
          const id = uuidv4();
          draft.projects[id] = {
            feed,
            configuration: BASE_CONFIGURATION,
          };
        });
      });
    },

    loadFeedFromUrl: async (feedUrl) => {
      const data = await fetchFeed(feedUrl);
      if (!data) return;
      const feed = parseXML(data);
      set((state: FeedState) => {
        return produce(state, (draft) => {
          const id = uuidv4();
          draft.projects[id] = { feed, configuration: BASE_CONFIGURATION };
        });
      });
    },

    loadFeedFromFileContents: (fileContents) => {
      const feed = parseXML(fileContents);
      set((state: FeedState) => {
        return produce(state, (draft) => {
          const id = uuidv4();
          draft.projects[id] = { feed, configuration: BASE_CONFIGURATION };
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
    updateConfiguration: (
      id: string,
      configuration: Project["configuration"],
    ) => {
      set((state: FeedState) => {
        return produce(state, (draft) => {
          draft.projects[id].configuration = configuration;
        });
      });
    },
  };
});

loadState<FeedState>("feeds")
  .then((state) => {
    if (state) {
      feedStore.setState(state);
    }
  })
  .catch((e) => {
    console.error("Error loading state", e);
  });

feedStore.subscribe((state) => {
  persistState("feeds", state).catch((e) => {
    console.error("Error persisting state", e);
  });
});

export default feedStore;
