import jsonpath from "jsonpath";
import { timeToSeconds } from "./utils";
import { Feed } from "./schema/feed";

/**
 * The xml to json converting process is not perfect, it is not able to distinguish
 * between a single element and an array of elements.
 * This function is a workaround to fix this issue.
 */
function normalizeArrays(data: unknown): unknown {
  const arrayFields: string[] = [
    "rss.channel",
    "rss.channel[*].category",
    `rss.channel[*]['itunes:category']`,
    `rss.channel[*].item`,
    `rss.channel[*].link`,
    `rss.channel[*].item[*].link`,
  ];
  const d = data;
  for (const field of arrayFields) {
    jsonpath.apply(d, field, (value: unknown) => {
      if (!Array.isArray(value)) {
        return [value];
      }
      return value as unknown;
    });
  }
  return d;
}

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
  jsonpath.apply(
    data,
    `rss.channel[*].item[*]..["itunes:duration"]`,
    (value) => {
      if (typeof value === "string") {
        return timeToSeconds(value);
      }
      return value as unknown;
    },
  );
  return d;
}

function normalizeChannelLink(data: unknown): unknown {
  const d = data;

  const paths = [`rss.channel[*].link[*]`];

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
  jsonpath.apply(data, `rss.channel[*].item[*].guid`, (value) => {
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
    `rss.channel[*].item[*]`,
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
  data = normalizeArrays(data);
  data = normalizeChannelLink(data);
  data = normalizeItunesImage(data);
  data = normalizeBoolean(data);
  data = normalizeItunesDuration(data);
  data = normalizeStrings(data);
  data = normalizeGuid(data);
  data = normalizeSeasonEpisode(data);
  data = normalizeNamespaces(data);
  return data;
}
