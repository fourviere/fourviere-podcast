import { create } from "zustand";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";
import { loadState, persistState } from "../persister";
import { parseXML } from "@fourviere/core/lib/converter";
import { FEED_TEMPLATE } from "@fourviere/core/lib/const";
import { fetchFeed } from "../../native/network";
import { Configuration, Project } from "./types";

const DEFAULT_FEED_FILENAME = "feed.xml";

const BASE_CONFIGURATION: Configuration = {
  feed: {
    filename: DEFAULT_FEED_FILENAME,
  },
  remotes: {
    remote: "none",
  },
  meta: {
    lastFeedUpdate: new Date(),
    feedIsDirty: false,
  },
};

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
  patchFeedFromUrl: (feedUrl: string, id: string) => Promise<void>;
  loadFeedFromFileContents: (feed: string) => void;
}

const feedStore = create<FeedState>((set, get) => {
  return {
    projects: {},
    getProjectById: (id) => {
      return get().projects[id];
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
          //extract filename from url
          const filename = feedUrl.split("/").pop() || DEFAULT_FEED_FILENAME;

          const id = uuidv4();
          const configuration = {
            ...BASE_CONFIGURATION,
            feed: { ...BASE_CONFIGURATION.feed, filename },
          };
          draft.projects[id] = { feed, configuration };
          draft.projects[id].configuration.feed.filename = filename;
        });
      });
    },

    patchFeedFromUrl: async (feedUrl, id) => {
      const data = await fetchFeed(feedUrl);
      if (!data) return;
      const feed = parseXML(data);
      set((state: FeedState) => {
        return produce(state, (draft) => {
          draft.projects[id].feed = feed;
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
          // draft.projects[id].feed.rss.channel[0].lastBuildDate =
          //   new Date().toUTCString();
          draft.projects[id].configuration.meta.lastFeedUpdate = new Date();
          draft.projects[id].configuration.meta.feedIsDirty = true;
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
