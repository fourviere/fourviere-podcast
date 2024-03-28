import { Type, Static } from "@sinclair/typebox";
import { ItunesItemSchema } from "./itunes/item";
import { RSSItemSchema } from "./rss/item";

export const ItemSchema = Type.Intersect([RSSItemSchema, ItunesItemSchema]);
export type Item = Static<typeof ItemSchema>;
