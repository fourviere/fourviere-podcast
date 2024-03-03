import { Static, Type } from "@sinclair/typebox";
import { ChannelSchema } from "./channel";

const FeedSchema = Type.Object({
  rss: Type.Object({
    "@": Type.Object({
      version: Type.Literal("2.0"),
      "xmlns:itunes": Type.Literal(
        "http://www.itunes.com/dtds/podcast-1.0.dtd",
      ),
      "xmlns:podcast": Type.Literal(
        "https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md",
      ),
    }),
    channel: Type.Array(ChannelSchema),
  }),
});

export default FeedSchema;
export type Feed = Static<typeof FeedSchema>;
