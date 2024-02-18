import { create } from "zustand";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";
import { loadState, persistState } from "../persister";
import { parseXML } from "@fourviere/core/lib/converter";
import { FEED_TEMPLATE } from "@fourviere/core/lib/const";
import { fetchFeed } from "../../native/network";
import { Configuration, Project } from "./types";
import { Item } from "@fourviere/core/lib/schema/item";

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
  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project;
  updateFeed: (id: string, feed: Project["feed"]) => void;
  updateConfiguration: (
    id: string,
    configuration: Project["configuration"],
  ) => void;
  loadFeedFromUrl: (feedUrl: string) => Promise<void>;
  patchFeedFromUrl: (feedUrl: string, id: string) => Promise<void>;
  loadFeedFromFileContents: (feed: string) => void;
  patchFeedFromFileContents: (feed: string, id: string) => void;
  addEpisodeToProject: (feed: string) => void;
  deleteEpisodeFromProject: (feec: string, episodeGUID: string) => void;
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

    deleteProject: (id: string) => {
      set((state: FeedState) => {
        return produce(state, (draft) => {
          delete draft.projects[id];
        });
      });
    },

    loadFeedFromUrl: async (feedUrl) => {
      const data = await fetchFeed(feedUrl);
      if (!data) return;
      const feed = parseXML(data);
      set((state: FeedState) => {
        return produce(state, (draft) => {
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
      console.log("updateFeed", id);
      set((state: FeedState) => {
        return produce(state, (draft) => {
          draft.projects[id].feed = feed;
          draft.projects[id].feed.rss.channel[0].lastBuildDate =
            new Date().toUTCString();
          draft.projects[id].configuration.meta.lastFeedUpdate = new Date();
          draft.projects[id].configuration.meta.feedIsDirty = true;
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
          draft.projects[id].configuration.meta.lastFeedUpdate = new Date();
          draft.projects[id].configuration.meta.feedIsDirty = false;
        });
      });
    },

    patchFeedFromFileContents: (fileContents, id) => {
      const feed = parseXML(fileContents);
      set((state: FeedState) => {
        return produce(state, (draft) => {
          draft.projects[id].feed = feed;
          draft.projects[id].configuration.meta.lastFeedUpdate = new Date();
          draft.projects[id].configuration.meta.feedIsDirty = false;
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

    deleteEpisodeFromProject: (id: string, episodeGUID: string) => {
      set((state: FeedState) => {
        return produce(state, (draft) => {
          draft.projects[id].feed.rss.channel[0].item = draft.projects[
            id
          ].feed.rss.channel[0].item?.filter(
            (item) => item.guid["#text"] !== episodeGUID,
          );
        });
      });
    },

    addEpisodeToProject: (id: string) => {
      set((state: FeedState) => {
        return produce(state, (draft) => {
          const episode = {
            title: "New episode",
            guid: {
              "#text": uuidv4(),
              "@": { isPermaLink: "false" },
            },
            enclosure: {
              "@": {
                url: "",
                length: "0",
                type: "audio/mpeg",
              },
            },
            "itunes:duration": 0,
          } as Item;
          draft.projects[id].feed.rss.channel[0].item?.unshift(episode);
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
