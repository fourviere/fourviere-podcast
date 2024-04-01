import jsonpath from "jsonpath";
import { timeToSeconds } from "./utils";
import { Feed } from "@fourviere/core/lib/schema/feed";

function normalizeStrings(data: unknown): unknown {
  const stringFields: string[] = ["$..copyright"];
  const d = data;
  for (const field of stringFields) {
    jsonpath.apply(d, field, (value: unknown) => {
      if (typeof value !== "string") {
        return String(value);
      }
      return value;
    });
  }
  return d;
}

function normalizeItunesImage(data: unknown): unknown {
  const d = data;
  jsonpath.apply(data, `$..["itunes:image"]`, (value) => {
    if (typeof value === "string") {
      return {
        "@": {
          href: value,
        },
      };
    }
    return value as unknown;
  });
  return d;
}

function normalizeBoolean(data: unknown): unknown {
  const fields: string[] = [
    `$..["itunes:explicit"]`,
    `$..item[*].guid["@"].isPermaLink`,
    `$..["podcast:value"]["podcast:valueRecipient"]["@"].fee`,
  ];

  const d = data;
  fields.forEach((field) => {
    jsonpath.apply(d, field, (value) => {
      if (typeof value === "boolean") {
        return value ? "true" : "false";
      }
      return value as unknown;
    });
  });

  return d;
}

function normalizeItunesDuration(data: unknown): unknown {
  const d = data;
  jsonpath.apply(data, `rss.channel.item[*]..["itunes:duration"]`, (value) => {
    if (typeof value === "string") {
      return timeToSeconds(value);
    }
    return value as unknown;
  });
  return d;
}

function normalizeChannelLink(data: unknown): unknown {
  const d = data;

  const paths = [`rss.channel.link[*]`];

  paths.forEach((path) => {
    jsonpath.apply(d, path, (value) => {
      if (typeof value === "string") {
        return {
          "@": {
            href: value,
          },
        };
      }
      return value as unknown;
    });
  });

  return d;
}

function normalizeGuid(data: unknown): unknown {
  const d = data;
  jsonpath.apply(data, `rss.channel.item[*].guid`, (value) => {
    if (typeof value === "string") {
      return {
        "#text": value,
      };
    }
    return value as unknown;
  });
  return d;
}

function normalizeSeasonEpisode(data: unknown): unknown {
  const d = data;
  jsonpath.apply(
    data,
    `rss.channel.item[*]`,
    (value: { [key: string]: unknown }) => {
      const dd = {
        ...(value as Record<string, unknown>),
        ...(value["itunes:season"]
          ? { "podcast:season": value["itunes:season"] }
          : undefined),
        ...(value["itunes:episode"]
          ? { "podcast:episode": value["itunes:episode"] }
          : undefined),
      };
      //itunes:season and itunes:episode are not valid in the final feed
      delete dd["itunes:season" as keyof typeof dd];
      delete dd["itunes:episode" as keyof typeof dd];
      return dd;
    },
  );
  return d;
}

function normalizePodcastBlock(data: unknown): unknown {
  const d = data;
  jsonpath.apply(data, `rss.channel["podcast:block"].*`, (value) => {
    console.log("value", value);
    if (typeof value === "string") {
      return {
        "#text": value,
      };
    }
    return value as unknown;
  });
  return d;
}

function normalizeNamespaces(data: unknown): Feed {
  //check if minimal namespace are there and inject the basic ones
  const d = data as Feed;
  const ITUNES_VALUE = "http://www.itunes.com/dtds/podcast-1.0.dtd";
  const PODCAST_VALUE =
    "https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md";

  const namespacesInUse = d["rss"]?.["@"];

  if (!namespacesInUse || !Object.keys(namespacesInUse).length) {
    if (d["rss"]?.["@"] === undefined) {
      d["rss"] = {
        ...d["rss"],
        "@": {
          version: "2.0",
          "xmlns:itunes": ITUNES_VALUE,
          "xmlns:podcast": PODCAST_VALUE,
        },
      };
    }
    d["rss"]["@"] = {
      version: "2.0",
      "xmlns:itunes": ITUNES_VALUE,
      "xmlns:podcast": PODCAST_VALUE,
    };
  }

  if (
    !namespacesInUse?.["xmlns:itunes"] ||
    namespacesInUse?.["xmlns:itunes"] !== ITUNES_VALUE
  ) {
    d["rss"]["@"]["xmlns:itunes"] = ITUNES_VALUE;
  }

  if (
    !namespacesInUse?.["xmlns:podcast"] ||
    namespacesInUse?.["xmlns:podcast"] !== PODCAST_VALUE
  ) {
    d["rss"]["@"]["xmlns:podcast"] = PODCAST_VALUE;
  }

  if (!namespacesInUse?.["version"] || namespacesInUse?.["version"] !== "2.0") {
    d["rss"]["@"]["version"] = "2.0";
  }

  return d;
}

export function normalize(data: unknown): unknown {
  data = normalizeChannelLink(data);
  data = normalizeItunesImage(data);
  data = normalizeBoolean(data);
  data = normalizeItunesDuration(data);
  data = normalizeStrings(data);
  data = normalizeGuid(data);
  data = normalizeSeasonEpisode(data);
  data = normalizeNamespaces(data);
  data = normalizePodcastBlock(data);
  return data;
}
