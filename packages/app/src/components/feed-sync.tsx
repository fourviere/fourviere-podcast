import Button from "@fourviere/ui/lib/button";

import { confirm } from "@tauri-apps/api/dialog";
import UseCurrentFeed from "../hooks/useCurrentFeed";
import UseRemoteConf from "../hooks/use-remote-conf";
import { useState } from "react";
import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import appStore from "../store/app";
import feedStore from "../store/feed";

export default function FeedSync() {
  const [loading, setLoading] = useState<boolean>(false);
  const currentFeed = UseCurrentFeed()!;
  const { configuration } = currentFeed;
  const { hasRemote, currentRemote } = UseRemoteConf({
    feedId: currentFeed.feedId!,
  });
  const { getTranslations, addError } = appStore((state) => state);
  const t = getTranslations();
  const { patchFeedFromUrl } = feedStore((state) => state);

  async function askForOverwrite() {
    return await confirm(t["edit_feed.feed-uploader.ask_overwrite"], {
      title: t["edit_feed.feed-uploader.ask_overwrite.title"],
      type: "warning",
    });
  }

  async function filePatch() {
    if (!hasRemote) {
      alert("No remote configuration found");
    } else {
      try {
        const { https, http_host, path } = currentRemote!;
        const feedUrl = `${https ? "https" : "http"}://${http_host}/${path}/${
          configuration.feed.filename
        }`;

        if (await askForOverwrite()) {
          setLoading(true);
          await patchFeedFromUrl(feedUrl, currentFeed.feedId!);
          console.log("Feed updated", currentFeed.feedId);
          setLoading(false);
        }
      } catch (e) {
        addError(t["edit_feed.feed-uploader.remote_feed_not_valid"]);
        setLoading(false);
      }
    }
  }

  return (
    <Button
      wfull
      size="md"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={() => filePatch()}
      isLoading={loading}
      Icon={ArrowUpCircleIcon}
    >
      {t["edit_feed.feed-sync.button_label"]}
    </Button>
  );
}
