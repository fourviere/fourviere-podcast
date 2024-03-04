import { Type } from "@sinclair/typebox";

// ITUNES http://www.itunes.com/dtds/podcast-1.0.dtd
export const ItunesChannelSchema = Type.Object({
  // REQUIRED
  "itunes:image": Type.Object({
    "@": Type.Object({
      href: Type.String(),
    }),
  }),

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
  // XML convert the "false" value as boolean
  "itunes:explicit": Type.String(),
  // OPTIONAL
  "itunes:author": Type.Optional(Type.String()),
  "itunes:owner": Type.Optional(
    Type.Object({
      "itunes:name": Type.String(),
      "itunes:email": Type.Optional(Type.String()),
    }),
  ),

  "itunes:type": Type.Optional(
    Type.Union([Type.Literal("episodic"), Type.Literal("serial")]),
  ),
  "itunes:new-feed-url": Type.Optional(Type.String()),
  "itunes:block": Type.Optional(Type.Literal("yes")),
  "itunes:complete": Type.Optional(Type.Literal("yes")),
});
