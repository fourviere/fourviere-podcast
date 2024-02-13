import Button from "@fourviere/ui/lib/button";

import { confirm, save } from "@tauri-apps/api/dialog";
import { documentDir } from "@tauri-apps/api/path";
import { invoke } from "@tauri-apps/api/tauri";
import { fetchFeed } from "../native/network";
import { parseXML, serializeToXML } from "@fourviere/core/lib/converter";
import UseCurrentFeed from "../hooks/useCurrentFeed";
import UseRemoteConf from "../hooks/use-remote-conf";

export default function FeedUploader() {
  const currentFeed = UseCurrentFeed()!;
  const { feed, configuration } = currentFeed;
  const { hasRemote, currentRemote, remote } = UseRemoteConf({
    feedId: currentFeed.feedId!,
  });

  async function localPersist(xmlData: string) {
    const selected = await save({
      title: "Save your feed",
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
        // notify user
        console.error(e);
      }

      //notify user
    }
  }

  async function isLocalLatest(url: string, localLastUpdate: Date) {
    const data = await fetchFeed(url);

    console.log(data);

    const feed = parseXML(data!);
    if (!feed.rss.channel[0].lastBuildDate) {
      //notify user
      console.error("no last build date in the remote feed");
      return;
    }

    const remoteLastUpdate = new Date(feed.rss.channel[0].lastBuildDate);

    return remoteLastUpdate.getTime() < localLastUpdate.getTime();
  }

  async function askForOverwrite() {
    return await confirm(
      "You are overwriting the remote feed that seem more recent, are you sure? This operation cannot be reverted",
      {
        title: "Overwrite",
        type: "warning",
      },
    );
  }

  async function feedNotValidFromURL() {
    return await confirm(
      "The feed URL point to a non valid feed, do you want to overwrite it?",
      {
        title: "Overwrite",
        type: "warning",
      },
    );
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
        const confirmed = await feedNotValidFromURL();
        if (!confirmed) {
          return;
        }
        isLocalFeedLatest = true;
      }

      if (!isLocalFeedLatest) {
        const confirmed = await askForOverwrite();
        if (!confirmed) {
          return;
        }
      }

      try {
        const res = await invoke(`${remote.remote}_xml_upload`, {
          payload: {
            content: xml,
            file_name: configuration.feed.filename,
            ...configuration.remotes.s3,
          },
        });
        console.log(res);
      } catch (e) {
        //notify user
        console.error(e);
      }
    }
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <Button wfull size="md" onClick={() => fileUpload()}>
      Force Update
    </Button>
  );
}
