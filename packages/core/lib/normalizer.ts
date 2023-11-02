import jsonpath from "jsonpath";

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
  let d = data;
  for (const field of arrayFields) {
    jsonpath.apply(d, field, (value: unknown) => {
      if (!Array.isArray(value)) {
        return [value];
      }
      return value;
    });
  }
  return d;
}

function normalizeItunesImage(data: unknown): unknown {
  let d = data;
  jsonpath.apply(data, `$..["itunes:image"]`, (value) => {
    if (typeof value === "string") {
      return {
        "@": {
          href: value,
        },
      };
    }
    return value;
  });
  return d;
}

function normalizeItunesExplicit(data: unknown): unknown {
  let d = data;
  jsonpath.apply(data, `$..["itunes:explicit"]`, (value) => {
    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }
    return value;
  });
  return d;
}

function normalizeItunesDuration(data: unknown): unknown {
  let d = data;
  jsonpath.apply(data, `$..["itunes:duration"]`, (value) => {
    if (typeof value !== "number") {
      return Number(value);
    }
    return value;
  });
  return d;
}

function normalizeChannelLink(data: unknown): unknown {
  let d = data;

  const paths = [`rss.channel[*].link[*]`, `rss.channel[*].item[*].link[*]`];

  paths.forEach((path) => {
    jsonpath.apply(d, path, (value) => {
      if (typeof value === "string") {
        return {
          "@": {
            href: value,
          },
        };
      }
      return value;
    });
  });

  return d;
}
export function normalize(data: unknown): unknown {
  data = normalizeArrays(data);
  data = normalizeChannelLink(data);
  data = normalizeItunesImage(data);
  data = normalizeItunesExplicit(data);
  data = normalizeItunesDuration(data);
  return data;
}
