import { normalize } from "../lib/normalizer";

describe("PodcastNormalizer", () => {
  it("normalize itunes:image", () => {
    const data = {
      rss: {
        channel: {
          "itunes:image": "https://example.com/image.png",
        },
      },
    };
    expect(normalize(data)).toEqual({
      rss: {
        "@": {
          version: "2.0",
          "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
          "xmlns:podcast":
            "https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md",
        },
        channel: {
          "itunes:image": {
            "@": {
              href: "https://example.com/image.png",
            },
          },
        },
      },
    });
  });
  it("normalize itunes:explicit", () => {
    const data = {
      rss: {
        channel: {
          "itunes:explicit": true,
        },
      },
    };
    expect(normalize(data)).toEqual({
      rss: {
        "@": {
          version: "2.0",
          "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
          "xmlns:podcast":
            "https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md",
        },
        channel: {
          "itunes:explicit": "true",
        },
      },
    });
  });
  describe("normalize itunes:duration", () => {
    it("normalize simple", () => {
      const data = {
        rss: {
          channel: {
            item: [
              {
                "itunes:duration": "01:01:01",
              },
            ],
          },
        },
      };
      expect(normalize(data)).toEqual({
        rss: {
          "@": {
            version: "2.0",
            "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
            "xmlns:podcast":
              "https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md",
          },
          channel: {
            item: [
              {
                "itunes:duration": 3661,
              },
            ],
          },
        },
      });
    });
    it("normalize partial 1", () => {
      const data = {
        rss: {
          channel: {
            item: [
              {
                "itunes:duration": "01",
              },
            ],
          },
        },
      };
      expect(normalize(data)).toEqual({
        rss: {
          "@": {
            version: "2.0",
            "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
            "xmlns:podcast":
              "https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md",
          },
          channel: {
            item: [
              {
                "itunes:duration": 1,
              },
            ],
          },
        },
      });
    });
    it("normalize partial 2", () => {
      const data = {
        rss: {
          channel: {
            item: [
              {
                "itunes:duration": "10:01",
              },
            ],
          },
        },
      };
      expect(normalize(data)).toEqual({
        rss: {
          "@": {
            version: "2.0",
            "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
            "xmlns:podcast":
              "https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md",
          },
          channel: {
            item: [
              {
                "itunes:duration": 601,
              },
            ],
          },
        },
      });
    });
  });

  it("normalize channel link", () => {
    const data = {
      rss: {
        channel: {
          link: ["https://example.com"],
        },
      },
    };
    expect(normalize(data)).toEqual({
      rss: {
        "@": {
          version: "2.0",
          "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
          "xmlns:podcast":
            "https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md",
        },
        channel: {
          link: [
            {
              "@": {
                href: "https://example.com",
              },
            },
          ],
        },
      },
    });
  });

  it("normalize strings", () => {
    const data = {
      rss: {
        channel: {
          copyright: 1234,
        },
      },
    };
    expect(normalize(data)).toEqual({
      rss: {
        "@": {
          version: "2.0",
          "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
          "xmlns:podcast":
            "https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md",
        },
        channel: {
          copyright: "1234",
        },
      },
    });
  });
  it("normalize guid", () => {
    const data = {
      rss: {
        channel: {
          item: [
            {
              guid: "1234",
            },
          ],
        },
      },
    };
    expect(normalize(data)).toEqual({
      rss: {
        "@": {
          version: "2.0",
          "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
          "xmlns:podcast":
            "https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md",
        },
        channel: {
          item: [
            {
              guid: {
                "#text": "1234",
              },
            },
          ],
        },
      },
    });
  });

  describe("normalize namespaces", () => {
    it("normalize no namespaces", () => {
      const data = { rss: { channel: { item: [{ title: "Episode 1" }] } } };
      expect(normalize(data)).toEqual({
        rss: {
          "@": {
            version: "2.0",
            "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
            "xmlns:podcast":
              "https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md",
          },
          channel: {
            item: [
              {
                title: "Episode 1",
              },
            ],
          },
        },
      });
    });

    it("normalize adding podcast namespace", () => {
      const data = {
        rss: {
          "@": {
            version: "2.0",
            "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
          },
          channel: { item: [{ title: "Episode 1" }] },
        },
      };
      expect(normalize(data)).toEqual({
        rss: {
          "@": {
            version: "2.0",
            "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
            "xmlns:podcast":
              "https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md",
          },
          channel: {
            item: [
              {
                title: "Episode 1",
              },
            ],
          },
        },
      });
    });

    it("normalize adding itunes namespace", () => {
      const data = {
        rss: {
          "@": {
            version: "2.0",
            "xmlns:podcast":
              "https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md",
          },
          channel: { item: [{ title: "Episode 1" }] },
        },
      };
      expect(normalize(data)).toEqual({
        rss: {
          "@": {
            version: "2.0",
            "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
            "xmlns:podcast":
              "https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md",
          },
          channel: {
            item: [
              {
                title: "Episode 1",
              },
            ],
          },
        },
      });
    });

    it("normalize adding rss 2 version", () => {
      const data = {
        rss: {
          "@": {
            version: "1",
            "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
            "xmlns:podcast":
              "https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md",
          },
          channel: { item: [{ title: "Episode 1" }] },
        },
      };
      expect(normalize(data)).toEqual({
        rss: {
          "@": {
            version: "2.0",
            "xmlns:itunes": "http://www.itunes.com/dtds/podcast-1.0.dtd",
            "xmlns:podcast":
              "https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md",
          },
          channel: {
            item: [
              {
                title: "Episode 1",
              },
            ],
          },
        },
      });
    });
  });
});
