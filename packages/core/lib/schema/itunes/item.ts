import { Type } from "@sinclair/typebox";
// ITUNES http://www.itunes.com/dtds/podcast-1.0.dtd
export const ItunesItemSchema = Type.Object({
  // OPTIONAL
  "itunes:duration": Type.Optional(Type.Number()),
  /**
   * Artwork must be a minimum size of 1400 x 1400 pixels and a maximum size
   * of 3000 x 3000 pixels, in JPEG or PNG format, 72 dpi, with appropriate file
   * extensions (.jpg, .png), and in the RGB colorspace. These requirements are
   *  different from the standard RSS image tag specifications.
   */
  "itunes:image": Type.Optional(
    Type.Object({
      "@": Type.Object({
        href: Type.String(),
      }),
    }),
  ),
  "itunes:explicit": Type.Optional(Type.String()),
  // SITUATIONAL
  "itunes:title": Type.Optional(Type.String()),
  "itunes:subtitle": Type.Optional(Type.String()),
  "itunes:summary": Type.Optional(Type.String()),
  "itunes:keywords": Type.Optional(Type.String()),
  "itunes:episode": Type.Optional(Type.Number()),
  "itunes:season": Type.Optional(Type.Number()),
  "itunes:episodeType": Type.Optional(
    Type.Union([
      Type.Literal("full"),
      Type.Literal("trailer"),
      Type.Literal("bonus"),
    ]),
  ),
  "itunes:block": Type.Optional(Type.Literal("Yes")),
});
