import { Type } from "@sinclair/typebox";

// RSS SPECIFICATION https://www.rssboard.org/rss-specification
export const RSSItemSchema = Type.Object({
  title: Type.String(),
  enclosure: Type.Object({
    "@": Type.Object({
      url: Type.String(),
      length: Type.String(),
      type: Type.String(),
    }),
  }),
  guid: Type.Object({
    "#text": Type.String(),
    "@": Type.Optional(
      Type.Object({
        isPermaLink: Type.Optional(
          Type.Union([Type.Literal("true"), Type.Literal("false")]),
        ),
      }),
    ),
  }),
  pubDate: Type.String(),
  description: Type.String(),
  link: Type.Array(Type.String()),
  author: Type.Optional(Type.String()),
});
