import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import Ajv from "ajv";
import FeedSchema, { Feed } from "./schema/feed";
import { InvalidPodcastFeedError, InvalidXMLError } from "./errors";
import jsonpath from "jsonpath";

const CONFIG = {
  ignoreAttributes: false,
  attributeNamePrefix: "",
  attributesGroupName: "@",
  allowBooleanAttributes: true,
  format: true,
  trimValues: true,
};

const parser = new XMLParser(CONFIG);
const builder = new XMLBuilder(CONFIG);
const podcastValidator = new Ajv().compile(FeedSchema);

export function serializeToXML(feed: Feed): string {
  return builder.build(feed);
}

export async function parseXML(xmlString: string) {
  const validation = XMLValidator.validate(xmlString);
  if (validation !== true) {
    throw new InvalidXMLError("Invalid xml");
  }

  const jsData = makeArrays(parser.parse(xmlString)) as Feed;

  const isValid = podcastValidator(jsData);
  if (!isValid) {
    const validationErrors = podcastValidator.errors;
    throw new InvalidPodcastFeedError("Invalid podcast feed", validationErrors);
  }

  return jsData;
}

/**
 * The xml to json converting process is not perfect, it is not able to distinguish
 * between a single element and an array of elements.
 * This function is a workaround to fix this issue.
 */
function makeArrays(data: unknown): unknown {
  const arrayFields: string[] = [
    "rss.channel",
    "rss.channel[*].category",
    `rss.channel[*]['itunes:category']`,
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
