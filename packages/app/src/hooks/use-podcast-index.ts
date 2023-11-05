import { useState } from "react";
import appStore from "../store/app";

async function fetchPI(search: string, apiKey: string, apiSecret: string) {
  var apiHeaderTime = Math.floor(Date.now() / 1000);
  const enc = new TextEncoder();
  var data4Hash = apiKey + apiSecret + apiHeaderTime;
  var hash = await crypto.subtle.digest("SHA-1", enc.encode(data4Hash));

  var hash4Header = Array.from(new Uint8Array(hash))
    .map((v) => v.toString(16).padStart(2, "0"))
    .join("");

  let options = {
    method: "get",
    headers: {
      "X-Auth-Date": "" + apiHeaderTime,
      "X-Auth-Key": apiKey,
      Authorization: hash4Header,
      "User-Agent": "Fourviere/0.0.1",
    },
  };

  var url = `https://api.podcastindex.org/api/1.0/search/byterm?q=${search}&fulltext`;
  return await fetch(url, options).then((res) => res.json());
}

export const usePodcastIndex = (/* arguments */) => {
  const { getConfigurations, addError, getTranslations } = appStore(
    (state) => state
  );
  const [feeds, setFeeds] = useState<any[]>();
  const [isLoading, setIsLoading] = useState(false);

  const t = getTranslations();

  async function search(query: string) {
    const { apiSecret, apiKey, enabled } = getConfigurations("podcastIndex");
    if (!enabled || !apiSecret || !apiKey) {
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetchPI(query, apiKey, apiSecret);
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
