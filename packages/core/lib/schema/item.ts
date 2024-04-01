import { Type, Static } from "@sinclair/typebox";
import { ItunesItemSchema } from "./itunes/item";
import { RSSItemSchema } from "./rss/item";
import { PodcastItemSchema } from "./podcasting/item";

export const ItemSchema = Type.Intersect([
  RSSItemSchema,
  ItunesItemSchema,
  PodcastItemSchema,
]);
export type Item = Static<typeof ItemSchema>;
