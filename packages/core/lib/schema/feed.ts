import { Static, Type } from "@sinclair/typebox";
import { ChannelSchema } from "./channel";

const FeedSchema = Type.Object({
  rss: Type.Object({
    channel: Type.Array(ChannelSchema),
  }),
});

export default FeedSchema;
export type Feed = Static<typeof FeedSchema>;
