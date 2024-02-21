import Button from "@fourviere/ui/lib/button";
import UseCurrentFeed from "../hooks/use-current-feed";
import UseRemoteConf from "../hooks/use-remote-conf";
import { useState } from "react";
import { ArrowDownOnSquareIcon } from "@heroicons/react/24/outline";
import appStore from "../store/app";
import feedStore from "../store/feed";
import useSelectFile from "../hooks/use-select-file";
import { readFile } from "../native/fs";
import useConfirmationModal from "../hooks/use-confirmation-modal";

export default function FeedSync() {
  const [loading, setLoading] = useState<boolean>(false);
  const currentFeed = UseCurrentFeed()!;
  const { configuration } = currentFeed;
  const { hasRemote, currentRemote } = UseRemoteConf({
    feedId: currentFeed.feedId!,
  });
  const { getTranslations, addError } = appStore((state) => state);
  const t = getTranslations();
  const { patchFeedFromUrl, patchFeedFromFileContents } = feedStore(
    (state) => state,
  );
  const { askForConfirmation, renderConfirmationModal } =
    useConfirmationModal();

  async function filePatch() {
    if (!hasRemote) {
      const { openFile } = useSelectFile({
        onceSelected: async (selected) => {
          const content = await readFile(selected);
          if (!content) {
            return;
          }
          if (
            await askForConfirmation({
              title: t["edit_feed.feed-sync.ask_overwrite.title"],
              message: t["edit_feed.feed-sync.ask_overwrite"],
            })
          ) {
            patchFeedFromFileContents(currentFeed.feedId!, content);
          }
        },
        format: "feed",
      });

      openFile();
    } else {
      try {
        const { https, http_host, path } = currentRemote!;
        const feedUrl = `${https ? "https" : "http"}://${http_host}/${path}/${
          configuration.feed.filename
        }`;

        if (
          await askForConfirmation({
            title: t["edit_feed.feed-sync.ask_overwrite.title"],
            message: t["edit_feed.feed-sync.ask_overwrite"],
          })
        ) {
          setLoading(true);
          await patchFeedFromUrl(currentFeed.feedId!, feedUrl);
          setLoading(false);
        }
      } catch (e) {
        addError(t["edit_feed.feed-sync.error_fetching_feed"]);
        setLoading(false);
      }
    }
  }

  return (
    <>
      {renderConfirmationModal()}
      <Button
        size="lg"
        theme="secondary"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={() => filePatch()}
        isLoading={loading}
        Icon={ArrowDownOnSquareIcon}
      >
        {t["edit_feed.feed-sync.button_label"]}
      </Button>
    </>
  );
}
