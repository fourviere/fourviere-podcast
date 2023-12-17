import jsonpath from "jsonpath";
import { timeToSeconds } from "./utils";

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
    }
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
        "podcast:season": value["itunes:season"],
        "podcast:episode": value["itunes:episode"],
      };
      delete dd["itunes:season"];
      delete dd["itunes:episode"];
      return dd;
    }
  );
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
  return data;
}
