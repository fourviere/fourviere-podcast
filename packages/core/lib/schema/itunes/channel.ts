import { Type } from "@sinclair/typebox";

const itunesImageSchema = Type.Object({
  "@": Type.Object({
    href: Type.String(),
  }),
});
const itunesCategorySchema = Type.Array(
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
);
const itunesExplicitSchema = Type.String();
const itunesAuthorSchema = Type.String({ minLength: 3 });
const itunesOwnerSchema = Type.Object({
  "itunes:name": Type.String({ minLength: 3 }),
  "itunes:email": Type.String({ minLength: 3 }),
});
const itunesTypeSchema = Type.Union([
  Type.Literal("episodic"),
  Type.Literal("serial"),
]);
const itunesNewFeedUrlSchema = Type.String();
const itunesBlockSchema = Type.Union([Type.Literal("yes"), Type.Literal("no")]);
const itunesCompleteSchema = Type.Union([
  Type.Literal("yes"),
  Type.Literal("no"),
]);

// ITUNES http://www.itunes.com/dtds/podcast-1.0.dtd
export const ItunesChannelSchema = Type.Object({
  // REQUIRED
  "itunes:image": itunesImageSchema,

  "itunes:category": itunesCategorySchema,
  // XML convert the "false" value as boolean
  "itunes:explicit": itunesExplicitSchema,
  // OPTIONAL
  "itunes:author": Type.Optional(itunesAuthorSchema),
  "itunes:owner": Type.Optional(itunesOwnerSchema),

  "itunes:type": Type.Optional(itunesTypeSchema),
  "itunes:new-feed-url": Type.Optional(itunesNewFeedUrlSchema),
  "itunes:block": Type.Optional(itunesBlockSchema),
  "itunes:complete": Type.Optional(itunesCompleteSchema),
});

export {
  itunesImageSchema,
  itunesCategorySchema,
  itunesExplicitSchema,
  itunesAuthorSchema,
  itunesOwnerSchema,
  itunesTypeSchema,
  itunesNewFeedUrlSchema,
  itunesBlockSchema,
  itunesCompleteSchema,
};
