import { Type } from "@sinclair/typebox";

// RSS SPECIFICATION https://www.rssboard.org/rss-specification
const RSSItemSchema = Type.Object({
  title: Type.String(),
  link: Type.String(),
  description: Type.String(),
  guid: Type.Object({
    "#text": Type.String(),
    "@": Type.Object({
      isPermaLink: Type.Optional(
        Type.Union([Type.Literal("true"), Type.Literal("false")])
      ),
    }),
  }),
  pubDate: Type.String(),
  enclosure: Type.Object({
    "@": Type.Object({
      url: Type.String(),
      length: Type.String(),
      type: Type.String(),
    }),
  }),
});

// ITUNES http://www.itunes.com/dtds/podcast-1.0.dtd
const ItunesItemSchema = Type.Object({
  "itunes:duration": Type.Optional(Type.Number()),
  "itunes:image": Type.Optional(
    Type.Object({
      "@": Type.Object({
        href: Type.String(),
      }),
    })
  ),
  "itunes:explicit": Type.Optional(Type.String()),
  "itunes:episode": Type.Optional(Type.Number()),
  "itunes:season": Type.Optional(Type.Number()),
  "itunes:episodeType": Type.Optional(
    Type.Union([
      Type.Literal("full"),
      Type.Literal("trailer"),
      Type.Literal("bonus"),
    ])
  ),
  "itunes:block": Type.Optional(Type.Literal("Yes")),
});

export const ItemSchema = Type.Intersect([RSSItemSchema, ItunesItemSchema]);
