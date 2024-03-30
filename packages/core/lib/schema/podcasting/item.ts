import { Type } from "@sinclair/typebox";
import ValueSchema from "./value";

export const PodcastItemSchema = Type.Object({
  "podcast:value": Type.Optional(ValueSchema),
});
