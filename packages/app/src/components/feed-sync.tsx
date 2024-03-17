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
import { useTranslation } from "react-i18next";

export default function FeedSync() {
  const [loading, setLoading] = useState<boolean>(false);
  const currentFeed = UseCurrentFeed()!;
  const { configuration } = currentFeed;
  const { hasRemote, currentRemote } = UseRemoteConf({
    feedId: currentFeed.feedId!,
  });
  const { addError } = appStore((state) => state);
  const { t } = useTranslation("feed", {
    keyPrefix: "forms.configuration",
  });
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
              title: t("actions.fields.overwrite_from_remote.modalTitle"),
              message: t("actions.fields.overwrite_from_remote.modalMessage"),
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
        const pathWithSlash = path && path != "" ? `${path}/` : ``;
        const feedUrl = `${
          https ? "https" : "http"
        }://${http_host}/${pathWithSlash}${configuration.feed.filename}`;

        if (
          await askForConfirmation({
            title: t("actions.fields.overwrite_from_remote.modalTitle"),
            message: t("actions.fields.overwrite_from_remote.modalMessage"),
          })
        ) {
          setLoading(true);
          await patchFeedFromUrl(currentFeed.feedId!, feedUrl);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        addError((e as Error)?.message);
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
        {t("actions.fields.overwrite_from_remote.label")}
      </Button>
    </>
  );
}
