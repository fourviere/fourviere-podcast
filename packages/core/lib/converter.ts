import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import Ajv from "ajv";
import FeedSchema, { Feed } from "./schema/feed";
import { InvalidPodcastFeedError, InvalidXMLError } from "./errors";
import { normalize } from "./normalizer";

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
const podcastValidator = new Ajv({ allErrors: true }).compile(FeedSchema);

export function serializeToXML(feed: Feed): string {
  return builder.build(feed) as string;
}

export function parseXML(xmlString: string) {
  const validation = XMLValidator.validate(xmlString, {
    allowBooleanAttributes: true,
  });
  if (validation !== true) {
    console.log(validation.err);
    throw new InvalidXMLError(`Invalid xml ${JSON.stringify(validation.err)}`);
  }

  const jsData = normalize(parser.parse(xmlString)) as Feed;

  const isValid = podcastValidator(jsData);

  if (!isValid) {
    const validationErrors = podcastValidator.errors;
    console.log(validationErrors);
    console.log(jsData);
    throw new InvalidPodcastFeedError("Invalid podcast feed", validationErrors);
  }

  return jsData;
}
