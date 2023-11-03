import { normalize } from "../lib/normalizer";

describe("PodcastNormalizer", () => {
  it("normalize arrays", () => {
    const data = {
      rss: {
        channel: {
          category: {
            "itunes:category": "Technology",
          },
          "itunes:category": "Technology",
          item: {
            title: "Episode 1",
          },
        },
      },
    };
    expect(normalize(data)).toEqual({
      rss: {
        channel: [
          {
            category: [
              {
                "itunes:category": "Technology",
              },
            ],
            "itunes:category": ["Technology"],
            item: [
              {
                title: "Episode 1",
              },
            ],
          },
        ],
      },
    });
  });
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
        channel: [
          {
            "itunes:image": {
              "@": {
                href: "https://example.com/image.png",
              },
            },
          },
        ],
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
        channel: [
          {
            "itunes:explicit": "true",
          },
        ],
      },
    });
  });
  describe("normalize itunes:duration", () => {
    it("normalize simple", () => {
      const data = {
        rss: {
          channel: {
            item: {
              "itunes:duration": "01:01:01",
            },
          },
        },
      };
      expect(normalize(data)).toEqual({
        rss: {
          channel: [
            {
              item: [
                {
                  "itunes:duration": 3661,
                },
              ],
            },
          ],
        },
      });
    });
    it("normalize partial 1", () => {
      const data = {
        rss: {
          channel: {
            item: {
              "itunes:duration": "01",
            },
          },
        },
      };
      expect(normalize(data)).toEqual({
        rss: {
          channel: [
            {
              item: [
                {
                  "itunes:duration": 1,
                },
              ],
            },
          ],
        },
      });
    });
    it("normalize partial 2", () => {
      const data = {
        rss: {
          channel: {
            item: {
              "itunes:duration": "10:01",
            },
          },
        },
      };
      expect(normalize(data)).toEqual({
        rss: {
          channel: [
            {
              item: [
                {
                  "itunes:duration": 601,
                },
              ],
            },
          ],
        },
      });
    });
  });

  it("normalize channel link", () => {
    const data = {
      rss: {
        channel: {
          link: "https://example.com",
        },
      },
    };
    expect(normalize(data)).toEqual({
      rss: {
        channel: [
          {
            link: [
              {
                "@": {
                  href: "https://example.com",
                },
              },
            ],
          },
        ],
      },
    });
  });
  it("normalize item link", () => {
    const data = {
      rss: {
        channel: {
          item: {
            link: "https://example.com",
          },
        },
      },
    };
    expect(normalize(data)).toEqual({
      rss: {
        channel: [
          {
            item: [
              {
                link: [
                  {
                    "@": {
                      href: "https://example.com",
                    },
                  },
                ],
              },
            ],
          },
        ],
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
        channel: [
          {
            copyright: "1234",
          },
        ],
      },
    });
  });
  it("normalize guid", () => {
    const data = {
      rss: {
        channel: {
          item: {
            guid: "1234",
          },
        },
      },
    };
    expect(normalize(data)).toEqual({
      rss: {
        channel: [
          {
            item: [
              {
                guid: {
                  "#text": "1234",
                },
              },
            ],
          },
        ],
      },
    });
  });
});
