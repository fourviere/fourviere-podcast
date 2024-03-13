import { Static, Type } from "@sinclair/typebox";

// RSS SPECIFICATION https://www.rssboard.org/rss-specification
// export const RSSChannelSchema = Type.Object({
//   // MANDATORY
//   title: Type.String(),
//   description: Type.String(),
//   link: Type.Optional(
//     Type.Array(
//       Type.Object({
//         "#text": Type.Optional(Type.String()),
//         "@": Type.Object({
//           rel: Type.Optional(Type.String()),
//           type: Type.Optional(Type.String()),
//           href: Type.Optional(Type.String()),
//         }),
//       }),
//     ),
//   ),

//   // OPTIONAL
//   category: Type.Optional(Type.Array(Type.String())),
//   copyright: Type.Optional(Type.String()),
//   generator: Type.Optional(Type.String()),
//   image: Type.Optional(
//     Type.Object({
//       url: Type.String(),
//       title: Type.String(),
//       link: Type.String(),
//       description: Type.Optional(Type.String()),
//       height: Type.Optional(Type.Number()),
//       width: Type.Optional(Type.Number()),
//     }),
//   ),
//   language: Type.Optional(Type.String()),
//   lastBuildDate: Type.Optional(Type.String()),
//   managingEditor: Type.Optional(Type.String()),
//   pubDate: Type.Optional(Type.String()),
//   skipHours: Type.Optional(
//     Type.Array(
//       Type.Object({
//         hour: Type.Number(),
//       }),
//     ),
//   ),
//   skipDays: Type.Optional(
//     Type.Array(
//       Type.Object({
//         day: Type.Union([
//           Type.Literal("Monday"),
//           Type.Literal("Tuesday"),
//           Type.Literal("Wednesday"),
//           Type.Literal("Thursday"),
//           Type.Literal("Friday"),
//           Type.Literal("Saturday"),
//           Type.Literal("Sunday"),
//         ]),
//       }),
//     ),
//   ),
//   webMaster: Type.Optional(Type.String()),
//   ttl: Type.Optional(Type.Number()),
// });

const titleSchema = Type.String({ minLength: 3 });
const descriptionSchema = Type.String();
const linkSchema = Type.Array(
  Type.Object({
    "#text": Type.Optional(Type.String()),
    "@": Type.Object({
      rel: Type.Optional(Type.String()),
      type: Type.Optional(Type.String()),
      href: Type.Optional(Type.String()),
    }),
  }),
);
const categorySchema = Type.Array(Type.String());
const copyrightSchema = Type.String();
const generatorSchema = Type.String();
const imageSchema = Type.Object({
  url: Type.String({
    minLength: 3,
    pattern: "^(https?|http?)://",
  }),
  title: Type.String(),
  link: Type.String(),
  description: Type.Optional(Type.String()),
  height: Type.Optional(Type.Number()),
  width: Type.Optional(Type.Number()),
});
const languageSchema = Type.String();
const lastBuildDateSchema = Type.String();
const managingEditorSchema = Type.String();
const pubDateSchema = Type.String();
const skipHoursSchema = Type.Array(
  Type.Object({
    hour: Type.Number(),
  }),
);
const skipDaysSchema = Type.Array(
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
);
const webMasterSchema = Type.String();
const ttlSchema = Type.Number();

const RSSChannelSchema = Type.Object({
  title: titleSchema,
  description: descriptionSchema,
  link: Type.Optional(linkSchema),
  category: Type.Optional(categorySchema),
  copyright: Type.Optional(copyrightSchema),
  generator: Type.Optional(generatorSchema),
  image: Type.Optional(imageSchema),
  language: Type.Optional(languageSchema),
  lastBuildDate: Type.Optional(lastBuildDateSchema),
  managingEditor: Type.Optional(managingEditorSchema),
  pubDate: Type.Optional(pubDateSchema),
  skipHours: Type.Optional(skipHoursSchema),
  skipDays: Type.Optional(skipDaysSchema),
  webMaster: Type.Optional(webMasterSchema),
  ttl: Type.Optional(ttlSchema),
});
type RSSChannel = Static<typeof RSSChannelSchema>;

export {
  RSSChannelSchema,
  titleSchema,
  descriptionSchema,
  linkSchema,
  categorySchema,
  copyrightSchema,
  generatorSchema,
  imageSchema,
  languageSchema,
  lastBuildDateSchema,
  managingEditorSchema,
  pubDateSchema,
  skipHoursSchema,
  skipDaysSchema,
  webMasterSchema,
  ttlSchema,
};

export type { RSSChannel };
