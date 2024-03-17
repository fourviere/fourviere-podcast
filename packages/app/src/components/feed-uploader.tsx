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
import { useTranslation } from "react-i18next";

export default function FeedUploader() {
  const [loading, setLoading] = useState<boolean>(false);
  const currentFeed = UseCurrentFeed()!;
  const { feed, configuration } = currentFeed;
  const { hasRemote, currentRemote, remote } = UseRemoteConf({
    feedId: currentFeed.feedId!,
  });
  const { addError } = appStore((state) => state);

  const { t } = useTranslation("feed", {
    keyPrefix: "sync",
  });

  const { askForConfirmation, renderConfirmationModal } =
    useConfirmationModal();

  async function localPersist(xmlData: string) {
    const selected = await save({
      title: t("save_title"),
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
        addError(t("error_persisting_feed"));
      }
    }
  }

  async function isLocalLatest(url: string, localLastUpdate: Date) {
    setLoading(true);
    const data = await fetchFeed(url);
    setLoading(false);

    const feed = parseXML(data!);
    if (!feed.rss.channel.lastBuildDate) {
      addError(t("remote_feed_not_valid"));
      return;
    }

    const remoteLastUpdate = new Date(feed.rss.channel.lastBuildDate);

    return remoteLastUpdate.getTime() < localLastUpdate.getTime();
  }

  async function fileUpload() {
    const xml = serializeToXML(feed);

    if (!hasRemote) {
      const xml = serializeToXML(feed);
      await localPersist(xml);
    } else {
      const { https, http_host, path } = currentRemote!;
      const pathWithSlash = path && path.length > 0 ? `${path}/` : "";
      const feedUrl = `${
        https ? "https" : "http"
      }://${http_host}/${pathWithSlash}${configuration.feed.filename}`;
      console.log(feedUrl);

      let isLocalFeedLatest;

      try {
        isLocalFeedLatest = await isLocalLatest(
          feedUrl,
          configuration.meta.lastFeedUpdate,
        );
      } catch (e) {
        const confirmed = await askForConfirmation({
          title: t("ask_overwrite.title"),
          message: t("ask_overwrite.not_valid"),
        });
        if (!confirmed) {
          addError(t("ask_overwrite.overwrite_skipped"));
          return;
        }
        isLocalFeedLatest = true;
      }

      if (!isLocalFeedLatest) {
        const confirmed = await askForConfirmation({
          title: t("ask_overwrite.title"),
          message: t("ask_overwrite.message"),
        });
        if (!confirmed) {
          addError(t("ask_overwrite.not_last_skip_overwrite"));
          return;
        }
      }

      try {
        if (remote.remote === "none") {
          return;
        }
        setLoading(true);
        await invoke(`${remote.remote}_upload`, {
          uploadableConf: {
            payload: xml,
            file_name: configuration.feed.filename,
            ...configuration.remotes[remote.remote],
          },
        });
      } catch (e) {
        //notify user
        console.error(e);
        addError(t("ask_overwrite.error_uploading_feed"));
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
        {t("title")}
      </Button>
    </>
  );
}
