import { Static, Type } from "@sinclair/typebox";

const titleSchema = Type.String({ minLength: 3 });
const descriptionSchema = Type.String({ minLength: 3 });
const linkSchema = Type.Object({
  "#text": Type.Optional(Type.String()),
  "@": Type.Object({
    rel: Type.Optional(Type.String()),
    type: Type.Optional(Type.String()),
    href: Type.Optional(Type.String({ format: "uri" })),
  }),
});
const linksSchema = Type.Array(linkSchema, {
  minItems: 1,
});
const categorySchema = Type.String();
const categoriesSchema = Type.Array(categorySchema);
const copyrightSchema = Type.String();
const generatorSchema = Type.String();
const imageSchema = Type.Object({
  url: Type.String({
    minLength: 3,
    format: "uri",
  }),
  title: Type.Optional(Type.String()),
  link: Type.Optional(Type.String()),
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
  link: Type.Optional(linksSchema),
  category: Type.Optional(categoriesSchema),
  copyright: Type.Optional(copyrightSchema),
  generator: Type.Optional(generatorSchema),
  image: Type.Optional(imageSchema),
  language: Type.Optional(languageSchema),
  lastBuildDate: Type.Optional(lastBuildDateSchema),
  managingEditor: Type.Optional(managingEditorSchema),
  webMaster: Type.Optional(webMasterSchema),
  pubDate: Type.Optional(pubDateSchema),
  skipHours: Type.Optional(skipHoursSchema),
  skipDays: Type.Optional(skipDaysSchema),
  ttl: Type.Optional(ttlSchema),
});
type RSSChannel = Static<typeof RSSChannelSchema>;

export {
  RSSChannelSchema,
  titleSchema,
  descriptionSchema,
  linksSchema,
  categoriesSchema,
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
