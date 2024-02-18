import { Configuration } from "../../app/src/store/feed/types";
import { Item } from "./schema/item";
import { v4 as uuidv4 } from "uuid";

export const FEED_TEMPLATE = `
<rss xmlns:podcast="https://github.com/Podcastindex-org/podcast-namespace/blob/main/docs/1.0.md" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" version="2.0">
    <channel>
        <title>Fourviere Podcast</title>
        <description>This is a fake show that exists only as an example of the "podcast" namespace tag usage.</description>
        <link>http://example.com/podcast</link>
        <docs>http://blogs.law.harvard.edu/tech/rss</docs>
        <language>en-US</language>
        <generator>Fourviere</generator>
        <pubDate>Fri, 09 Oct 2020 04:30:38 GMT</pubDate>
        <lastBuildDate>Fri, 09 Oct 2020 04:30:38 GMT</lastBuildDate>
        <managingEditor>john@example.com (John Doe)</managingEditor>
        <webMaster>support@example.com (Tech Support)</webMaster>
        <image>
            <url>https://example.com/images/pci_avatar-massive.jpg</url>
            <title>Podcast Feed Template</title>
            <link>https://example.com/show</link>
        </image>

        <podcast:funding url="https://example.com/donate">Support the show!</podcast:funding>

        <podcast:location geo="geo:30.2672,97.7431" osm="R113314">Austin, TX</podcast:location>
        <podcast:medium>podcast</podcast:medium>

        <itunes:author>John Doe</itunes:author>
        <itunes:explicit>false</itunes:explicit>
        <itunes:type>episodic</itunes:type>
        <itunes:category text="News"/>
        <itunes:category text="Technology"/>

        <itunes:owner>
        <itunes:name>John Doe</itunes:name>
        <itunes:email>johndoe@example.com</itunes:email>
        </itunes:owner>

        <itunes:image>https://example.com/images/pci_avatar-massive.jpg</itunes:image>
    </channel>
</rss>
`;
export const EPISODE_TEMPLATE = () =>
  ({
    title: "New episode",
    guid: {
      "#text": uuidv4(),
      "@": { isPermaLink: "false" },
    },
    enclosure: {
      "@": {
        url: "",
        length: "0",
        type: "audio/mpeg",
      },
    },
    pubDate: new Date().toUTCString(),
    "itunes:duration": 0,
  }) as Item;

export const DEFAULT_FEED_FILENAME = "feed.xml";

export const PROJECT_BASE_CONFIGURATION: Configuration = {
  feed: {
    filename: DEFAULT_FEED_FILENAME,
  },
  remotes: {
    remote: "none",
  },
  meta: {
    lastFeedUpdate: new Date(),
    feedIsDirty: false,
  },
};
