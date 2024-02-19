import { useState } from "react";
import appStore from "../store/app";

type Podcast = {
  id: number;
  title: string;
  url: string;
  originalUrl: string;
  link: string;
  description: string;
  author: string;
  ownerName: string;
  image: string;
  artwork: string;
  lastUpdateTime: number;
  lastCrawlTime: number;
  lastParseTime: number;
  inPollingQueue: number;
  priority: number;
  lastGoodHttpStatusTime: number;
  lastHttpStatus: number;
  contentType: string;
  itunesId: number;
  generator: string;
  language: string;
  type: number;
  dead: number;
  crawlErrors: number;
  parseErrors: number;
  categories: Record<string, string>;
  locked: number;
  explicit: boolean;
  podcastGuid: string;
  medium: string;
  episodeCount: number;
  imageUrlHash: number;
  newestItemPubdate: number;
};

async function fetchAPI(search: string, apiKey: string, apiSecret: string) {
  const apiHeaderTime = Math.floor(Date.now() / 1000);
  const enc = new TextEncoder();
  const data4Hash = apiKey + apiSecret + apiHeaderTime;
  const hash = await crypto.subtle.digest("SHA-1", enc.encode(data4Hash));

  const hash4Header = Array.from(new Uint8Array(hash))
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");

  const options = {
    method: "get",
    headers: {
      "X-Auth-Date": "" + apiHeaderTime,
      "X-Auth-Key": apiKey,
      Authorization: hash4Header,
      "User-Agent": "Fourviere/0.0.1",
    },
  };

  const url = `https://api.podcastindex.org/api/1.0/search/byterm?q=${search}&fulltext`;
  return (await fetch(url, options).then((res) => res.json())) as Promise<{
    feeds: Podcast[];
  }>;
}

export const usePodcastIndex = (/* arguments */) => {
  const { getConfigurations, addError, getTranslations } = appStore(
    (state) => state,
  );
  const [feeds, setFeeds] = useState<Podcast[]>();
  const [isLoading, setIsLoading] = useState(false);

  const t = getTranslations();

  async function search(query: string) {
    const { apiSecret, apiKey, enabled } = getConfigurations("podcastIndex");

    if (!enabled || !apiSecret || !apiKey) {
      addError(t["start.start_by_index.errors.podcast_index_misconfigured"]);
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetchAPI(query, apiKey, apiSecret);
      setFeeds(response.feeds);
    } catch (error) {
      addError(t["start.start_by_index.errors.generic"]);
    } finally {
      setIsLoading(false);
    }
  }

  function resetFeeds() {
    setFeeds(undefined);
  }

  return { search, feeds, isLoading, resetFeeds };
};
