import { Type } from "@sinclair/typebox";
import { ItemSchema } from "./item";

// RSS SPECIFICATION https://www.rssboard.org/rss-specification
const RSSChannelSchema = Type.Object({
  // MANDATORY
  title: Type.String(),
  description: Type.String(),
  link: Type.Optional(
    Type.Array(
      Type.Object({
        "#text": Type.Optional(Type.String()),
        "@": Type.Object({
          rel: Type.Optional(Type.String()),
          type: Type.Optional(Type.String()),
          href: Type.Optional(Type.String()),
        }),
      }),
    ),
  ),

  // OPTIONAL
  category: Type.Optional(Type.Array(Type.String())),
  copyright: Type.Optional(Type.String()),
  generator: Type.Optional(Type.String()),
  image: Type.Optional(
    Type.Object({
      url: Type.String(),
      title: Type.String(),
      link: Type.String(),
      description: Type.Optional(Type.String()),
      height: Type.Optional(Type.Number()),
      width: Type.Optional(Type.Number()),
    }),
  ),
  language: Type.Optional(Type.String()),
  lastBuildDate: Type.Optional(Type.String()),
  managingEditor: Type.Optional(Type.String()),
  pubDate: Type.Optional(Type.String()),
  skipHours: Type.Optional(
    Type.Array(
      Type.Object({
        hour: Type.Number(),
      }),
    ),
  ),
  skipDays: Type.Optional(
    Type.Array(
      Type.Object({
        day: Type.Union([
          Type.Literal("Monday"),
          Type.Literal("Tuesday"),
          Type.Literal("Wednesday"),
          Type.Literal("Thursday"),
          Type.Literal("Friday"),
          Type.Literal("Saturday"),
          Type.Literal("Sunday"),
        ]),
      }),
    ),
  ),
  webMaster: Type.Optional(Type.String()),
  ttl: Type.Optional(Type.Number()),
});

// ITUNES http://www.itunes.com/dtds/podcast-1.0.dtd
const ItunesChannelSchema = Type.Object({
  "itunes:image": Type.Optional(
    Type.Object({
      "@": Type.Object({
        href: Type.String(),
      }),
    }),
  ),
  "itunes:category": Type.Array(
    Type.Object({
      "@": Type.Object({
        text: Type.String(),
      }),
      "itunes:category": Type.Optional(
        Type.Object({
          "@": Type.Object({
            text: Type.String(),
          }),
        }),
      ),
    }),
  ),
  // XML convert the false value as boolean
  "itunes:explicit": Type.Optional(Type.String()),
  "itunes:keywords": Type.Optional(Type.String()),
  "itunes:author": Type.Optional(Type.String()),
  "itunes:link": Type.Optional(Type.String()),
  "itunes:owner": Type.Optional(
    Type.Object({
      "itunes:name": Type.String(),
      "itunes:email": Type.Optional(Type.String()),
    }),
  ),
  "itunes:type": Type.Optional(
    Type.Union([Type.Literal("episodic"), Type.Literal("serial")]),
  ),
  "itunes:block": Type.Optional(Type.Literal("yes")),
  "itunes:complete": Type.Optional(Type.Literal("yes")),
});

export const ChannelSchema = Type.Intersect([
  RSSChannelSchema,
  ItunesChannelSchema,
  Type.Object({
    item: Type.Optional(Type.Array(ItemSchema)),
  }),
]);
