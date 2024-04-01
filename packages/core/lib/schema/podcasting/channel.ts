import { Type } from "@sinclair/typebox";
import ValueSchema from "./value";

export const PodcastChannelSchema = Type.Object({
  "podcast:value": Type.Optional(ValueSchema),
  "podcast:medium": Type.Optional(Type.String()),
  "podcast:block": Type.Optional(
    Type.Array(
      Type.Union([
        Type.Object({
          "@": Type.Optional(
            Type.Object({
              id: Type.Optional(Type.String()),
            }),
          ),
          "#text": Type.String(),
        }),
        Type.String(),
      ]),
    ),
  ),
  "podcast:locked": Type.Optional(
    Type.Object({
      "@": Type.Object({
        owner: Type.Optional(Type.String()),
      }),
      "#text": Type.String(),
    }),
  ),
});
