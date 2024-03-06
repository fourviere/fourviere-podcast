import {
  XMLParser,
  XMLBuilder,
  XMLValidator,
  X2jOptions,
  XmlBuilderOptions,
} from "fast-xml-parser";
import Ajv from "ajv";
import FeedSchema, { Feed } from "@fourviere/core/lib/schema/feed";
import { InvalidPodcastFeedError, InvalidXMLError } from "./errors";
import { normalize } from "./normalizer";

const ARRAYS: string[] = [
  "rss.channel.category",
  `rss.channel.itunes:category`,
  `rss.channel.item`,
  `rss.channel.link`,
  `rss.channel.item.link`,
] as const;

const CONFIG_PARSER: X2jOptions = {
  // cdataPropName: "__cdata",
  ignoreAttributes: false,
  attributeNamePrefix: "",
  attributesGroupName: "@",
  allowBooleanAttributes: true,
  trimValues: true,
  parseAttributeValue: true,
  htmlEntities: true,
  isArray: (_tagName: string, jPath: string) => {
    return ARRAYS.includes(jPath);
  },
};

const CONFIG_BUILDER: XmlBuilderOptions = {
  cdataPropName: "__cdata",
  ignoreAttributes: false,
  attributeNamePrefix: "",
  attributesGroupName: "@",
};

const parser = new XMLParser(CONFIG_PARSER);
const builder = new XMLBuilder(CONFIG_BUILDER);
const podcastValidator = new Ajv({ allErrors: true }).compile(FeedSchema);

export function serializeToXML(feed: Feed): string {
  return builder.build(feed) as string;
}

export function parseXML(
  xmlString: string,
  skipRequiredCheck: boolean = false,
) {
  const validation = XMLValidator.validate(xmlString, {
    allowBooleanAttributes: true,
  });

  if (validation !== true) {
    throw new InvalidXMLError(`Invalid xml ${JSON.stringify(validation.err)}`);
  }

  const jsData = normalize(parser.parse(xmlString)) as Feed;

  const isValid = podcastValidator(jsData);

  // skip required check used for importing
  const errors = skipRequiredCheck
    ? podcastValidator.errors?.filter((error) => error.keyword !== "required")
    : podcastValidator.errors;

  if (!isValid && errors?.length) {
    const validationErrors = podcastValidator.errors;
    console.error(validationErrors);
    throw new InvalidPodcastFeedError("Invalid podcast feed", validationErrors);
  }

  return jsData;
}
