import { Type } from "@sinclair/typebox";
import ValueSchema from "./value";

export const PodcastItemSchema = Type.Object({
  "podcast:value": Type.Optional(ValueSchema),
  "podcast:season": Type.Optional(
    Type.Object({
      "#text": Type.Number(),
      "@": Type.Optional(
        Type.Object({
          name: Type.Optional(Type.String()),
        }),
      ),
    }),
  ),
  "podcast:episode": Type.Optional(
    Type.Object({
      "#text": Type.Number(),
      "@": Type.Optional(
        Type.Object({
          display: Type.Optional(Type.String()),
        }),
      ),
    }),
  ),
});
