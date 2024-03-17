import { Feed } from "@fourviere/core/lib/schema/feed";
import { Static, Type } from "@sinclair/typebox";

export interface Project {
  feed: Feed;
  configuration: Configuration;
}

export const configurationSchema = Type.Object({
  feed: Type.Object({
    filename: Type.String(),
  }),
  meta: Type.Object({
    lastFeedUpdate: Type.String(),
    feedIsDirty: Type.Boolean(),
  }),
  remotes: Type.Object({
    remote: Type.Union([
      Type.Literal("s3"),
      Type.Literal("ftp"),
      Type.Literal("none"),
    ]),
    s3: Type.Optional(
      Type.Object({
        endpoint: Type.String({ format: "uri" }),
        region: Type.String({ minLength: 2 }),
        bucket_name: Type.String({ minLength: 1 }),
        access_key: Type.String({ minLength: 1 }),
        secret_key: Type.String({ minLength: 1 }),
        path: Type.String(),
        https: Type.Boolean(),
        http_host: Type.String({ minLength: 1 }),
      }),
    ),
    ftp: Type.Optional(
      Type.Object({
        host: Type.String({ minLength: 1 }),
        port: Type.Number(),
        user: Type.String({ minLength: 1 }),
        password: Type.String({ minLength: 1 }),
        path: Type.Optional(Type.String()),
        https: Type.Boolean(),
        http_host: Type.String({ minLength: 1 }),
      }),
    ),
  }),
});
export type Configuration = Static<typeof configurationSchema>;
