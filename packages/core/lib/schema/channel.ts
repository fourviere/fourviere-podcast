import { Type } from "@sinclair/typebox";
import { ItemSchema } from "./item";
import { ItunesChannelSchema } from "./itunes/channel";
import { RSSChannelSchema } from "./rss/channel";

export const ChannelSchema = Type.Intersect([
  RSSChannelSchema,
  ItunesChannelSchema,
  Type.Object({
    item: Type.Optional(Type.Array(ItemSchema)),
  }),
]);
