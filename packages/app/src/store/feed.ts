import { create } from "zustand";
import { produce } from "immer";
import { v4 as uuidv4 } from "uuid";
import { Feed } from "../../../core/lib/schema/feed";

interface Configuration {}

interface FeedState {
  feeds: Record<string, Feed>;
  configurations: Record<string, Configuration>;
  currentFeed?: string;
}

const feedStore = create<FeedState>((set, _get) => {
  return {
    feeds: {},
    configurations: {},
    currentFeed: undefined,

    loadFeedFromUrl: async (feedUrl: string) => {
      const response = await fetch(feedUrl);
      const feed = await response.json();
      set((state: FeedState) => {
        return produce(state, (draft) => {
          draft.feeds[feedUrl] = feed;
          draft.currentFeed = feedUrl;
        });
      });
    },

    loadFeedFromData: (data: Feed) => {
      set((state: FeedState) => {
        return produce(state, (draft) => {
          const id = uuidv4();
          draft.feeds[id] = data;
          draft.currentFeed = id;
        });
      });
    },
  };
});

export default feedStore;
