import { Type } from "@sinclair/typebox";
import { ItemSchema } from "./item";
import { ItunesChannelSchema } from "./itunes/channel";
import { RSSChannelSchema } from "./rss/channel";
import { PodcastChannelSchema } from "./podcasting/channel";

export const ChannelSchema = Type.Intersect([
  RSSChannelSchema,
  ItunesChannelSchema,
  PodcastChannelSchema,
  Type.Object({
    item: Type.Optional(Type.Array(ItemSchema)),
  }),
]);
