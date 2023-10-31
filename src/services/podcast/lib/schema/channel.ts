import { Type } from "@sinclair/typebox";
import { ItemSchema } from "./item";

// RSS SPECIFICATION https://www.rssboard.org/rss-specification
const RSSChannelSchema = Type.Object({
  title: Type.String(),
  link: Type.String(),
  description: Type.String(),
  language: Type.Optional(Type.String()),
  copyright: Type.Optional(Type.String()),
  managingEditor: Type.Optional(Type.String()),
  webMaster: Type.Optional(Type.String()),
  pubDate: Type.Optional(Type.String()),
  lastBuildDate: Type.Optional(Type.String()),
  category: Type.Optional(
    Type.Union([Type.Array(Type.String()), Type.String()])
  ),
  generator: Type.Optional(Type.String()),
  image: Type.Optional(
    Type.Object({
      url: Type.String(),
      title: Type.String(),
      link: Type.String(),
    })
  ),
  ttl: Type.Optional(Type.Number()),
});

// ITUNES http://www.itunes.com/dtds/podcast-1.0.dtd
const ItunesChannelSchema = Type.Object({
  "itunes:image": Type.Optional(
    Type.Object({
      "@": Type.Object({
        href: Type.String(),
      }),
    })
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
        })
      ),
    })
  ),
  "itunes:explicit": Type.Optional(Type.String()),
  "itunes:author": Type.Optional(Type.String()),
  "itunes:link": Type.Optional(Type.String()),
  "itunes:owner": Type.Optional(
    Type.Object({
      "itunes:name": Type.String(),
      "itunes:email": Type.String(),
    })
  ),
  "itunes:type": Type.Optional(
    Type.Union([Type.Literal("episodic"), Type.Literal("serial")])
  ),
  "itunes:block": Type.Optional(Type.Literal("yes")),
  "itunes:complete": Type.Optional(Type.Literal("yes")),
});

export const ChannelSchema = Type.Intersect([
  RSSChannelSchema,
  ItunesChannelSchema,
  Type.Object({
    item: Type.Array(ItemSchema),
  }),
]);
