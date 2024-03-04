import { Type } from "@sinclair/typebox";

// RSS SPECIFICATION https://www.rssboard.org/rss-specification
export const RSSChannelSchema = Type.Object({
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
