import Button from "@fourviere/ui/lib/button";
import { save } from "@tauri-apps/api/dialog";
import { documentDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";
import { fetchFeed } from "../native/network";
import { parseXML, serializeToXML } from "@fourviere/core/lib/converter";
import UseCurrentFeed from "../hooks/use-current-feed";
import UseRemoteConf from "../hooks/use-remote-conf";
import { useState } from "react";
import { ArrowUpCircleIcon } from "@heroicons/react/24/outline";
import appStore from "../store/app";
import useConfirmationModal from "../hooks/use-confirmation-modal";

export default function FeedUploader() {
  const [loading, setLoading] = useState<boolean>(false);
  const currentFeed = UseCurrentFeed()!;
  const { feed, configuration } = currentFeed;
  const { hasRemote, currentRemote, remote } = UseRemoteConf({
    feedId: currentFeed.feedId!,
  });
  const { getTranslations, addError } = appStore((state) => state);
  const t = getTranslations();
  const { askForConfirmation, renderConfirmationModal } =
    useConfirmationModal();

  async function localPersist(xmlData: string) {
    const selected = await save({
      title: t["edit_feed.feed-uploader.save_title"],
      filters: [{ name: "XML", extensions: ["xml"] }],
      defaultPath: await documentDir(),
    });

    if (selected) {
      try {
        await invoke("persist_file", {
          payload: {
            path: selected,
            data: xmlData,
          },
        });
      } catch (e) {
        addError(t["edit_feed.feed-uploader.error_persisting_feed"]);
      }
    }
  }

  async function isLocalLatest(url: string, localLastUpdate: Date) {
    setLoading(true);
    const data = await fetchFeed(url);
    setLoading(false);

    const feed = parseXML(data!);
    if (!feed.rss.channel[0].lastBuildDate) {
      addError(t["edit_feed.feed-uploader.remote_feed_not_valid"]);
      return;
    }

    const remoteLastUpdate = new Date(feed.rss.channel[0].lastBuildDate);

    return remoteLastUpdate.getTime() < localLastUpdate.getTime();
  }

  async function fileUpload() {
    const xml = serializeToXML(feed);

    if (!hasRemote) {
      const xml = serializeToXML(feed);
      await localPersist(xml);
    } else {
      const { https, http_host, path } = currentRemote!;
      const feedUrl = `${https ? "https" : "http"}://${http_host}/${path}/${
        configuration.feed.filename
      }`;
      console.log(feedUrl);

      let isLocalFeedLatest;

      try {
        isLocalFeedLatest = await isLocalLatest(
          feedUrl,
          configuration.meta.lastFeedUpdate,
        );
      } catch (e) {
        const confirmed = await askForConfirmation({
          title: t["edit_feed.feed-uploader.ask_overwrite.title"],
          message: t["edit_feed.feed-uploader.ask_overwrite_not_valid"],
        });
        if (!confirmed) {
          addError(
            t["edit_feed.feed-uploader.ask_overwrite_not_valid_skip_overwrite"],
          );
          return;
        }
        isLocalFeedLatest = true;
      }

      if (!isLocalFeedLatest) {
        const confirmed = await askForConfirmation({
          title: t["edit_feed.feed-uploader.ask_overwrite.title"],
          message: t["edit_feed.feed-uploader.ask_overwrite"],
        });
        if (!confirmed) {
          addError(
            t["edit_feed.feed-uploader.ask_overwrite_not_last_skip_overwrite"],
          );
          return;
        }
      }

      try {
        setLoading(true);
        await invoke(`${remote.remote}_upload`, {
          uploadableConf: {
            payload: xml,
            file_name: configuration.feed.filename,
            ...configuration.remotes.s3,
          },
        });
      } catch (e) {
        //notify user
        addError(t["edit_feed.feed-uploader.error_uploading_feed"]);
      } finally {
        setLoading(false);
      }
    }
  }

  return (
    <>
      {renderConfirmationModal()}
      <Button
        wfull
        size="md"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={fileUpload}
        isLoading={loading}
        Icon={ArrowUpCircleIcon}
      >
        {t["edit_feed.feed-uploader.button_label"]}
      </Button>
    </>
  );
}
