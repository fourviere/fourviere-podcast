import { create } from "zustand";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";
import { loadState, persistState } from "../persister";
import { parseXML } from "@fourviere/core/lib/converter";
import {
  FEED_TEMPLATE,
  EPISODE_TEMPLATE,
  PROJECT_BASE_CONFIGURATION,
  DEFAULT_FEED_FILENAME,
} from "@fourviere/core/lib/const";
import { fetchFeed } from "../../native/network";
import { Project } from "./types";

export interface FeedState {
  projects: Record<string, Project>;

  createProject: () => void;
  initProjectFromUrl: (feedUrl: string) => Promise<void>;
  initProjectFromFileContents: (feed: string) => void;

  deleteProject: (id: string) => void;
  getProjectById: (id: string) => Project;

  updateFeed: (id: string, feed: Project["feed"]) => void;
  patchFeedFromUrl: (id: string, feedUrl: string) => Promise<void>;
  patchFeedFromFileContents: (id: string, feed: string) => void;

  updateConfiguration: (
    id: string,
    configuration: Project["configuration"],
  ) => void;

  addEpisodeToProject: (feed: string) => void;
  deleteEpisodeFromProject: (feed: string, episodeGUID: string) => void;
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
            configuration: PROJECT_BASE_CONFIGURATION,
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

    initProjectFromUrl: async (feedUrl) => {
      const data = await fetchFeed(feedUrl);
      if (!data) return;
      const feed = parseXML(data);
      set((state: FeedState) => {
        return produce(state, (draft) => {
          const filename = feedUrl.split("/").pop() || DEFAULT_FEED_FILENAME;

          const id = uuidv4();
          const configuration = {
            ...PROJECT_BASE_CONFIGURATION,
            feed: { ...PROJECT_BASE_CONFIGURATION.feed, filename },
          };
          draft.projects[id] = { feed, configuration };
          draft.projects[id].configuration.feed.filename = filename;
        });
      });
    },

    initProjectFromFileContents: (fileContents) => {
      const feed = parseXML(fileContents);
      set((state: FeedState) => {
        return produce(state, (draft) => {
          const id = uuidv4();
          draft.projects[id] = {
            feed,
            configuration: PROJECT_BASE_CONFIGURATION,
          };
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

    patchFeedFromUrl: async (id, feedUrl) => {
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

    patchFeedFromFileContents: (id, fileContents) => {
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
          console.log("deleteEpisodeFromProject", id, episodeGUID);
          draft.projects[id].feed.rss.channel[0].item = draft.projects[
            id
          ].feed.rss.channel[0].item?.filter(
            (item) => item.guid["#text"] !== episodeGUID,
          );
          console.log("finish deleting");
        });
      });
    },

    addEpisodeToProject: (id: string) => {
      set((state: FeedState) => {
        return produce(state, (draft) => {
          draft.projects[id].feed.rss.channel[0].item?.unshift(
            EPISODE_TEMPLATE(),
          );
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
