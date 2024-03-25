import { Type } from "@sinclair/typebox";
import ValueSchema from "./value";

export const PodcastChannelSchema = Type.Object({
  "podcast:value": Type.Optional(ValueSchema),
});
