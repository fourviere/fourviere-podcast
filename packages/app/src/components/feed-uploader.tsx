/**
 * Upload a feed in the ft s3 and check if we can reach the point
 * improve the type / no feed errors
 */

import { parseXML, serializeToXML } from "@fourviere/core/lib/converter";
import UseCurrentFeed from "../hooks/useCurrentFeed";
import { fetchFeed } from "../native/network";
import UseRemoteConf from "../hooks/use-remote-conf";
import { useState } from "react";
import Button from "@fourviere/ui/lib/button";
import { invoke } from "@tauri-apps/api";

export default function FeedUploader() {
  const currentFeed = UseCurrentFeed();
  const { forceUpdate, setForceUpdate } = useState(false);
  const { feed, configuration } = currentFeed!;

  const { hasRemote, currentRemote } = UseRemoteConf({
    feedId: currentFeed?.feedId,
  });

  async function upload() {
    //check if feed is newer than remote
    //create feed url
    if (currentFeed?.feedId) {
      if (hasRemote && currentRemote) {
        if (!currentFeed.configuration.meta.feedIsDirty) {
          console.error("feed is clean");
          return;
        }

        const feedUrl = `${currentRemote.https ? "https" : "http"}://${
          currentRemote.http_host
        }/${currentRemote.path}/${configuration.feed.filename}`;

        try {
          const data = await fetchFeed(feedUrl);
          // Remote data check
          if (!data) {
            console.error("no data in the remote feed");
            return;
          }

          const feed = parseXML(data);
          if (!feed.rss.channel[0].lastBuildDate) {
            console.error("no last build date in the remote feed");
            return;
          }

          const remoteLastUpdate = new Date(feed.rss.channel[0].lastBuildDate);
          const localLastUpdate = currentFeed.configuration.meta.lastFeedUpdate;

          console.log("remote", remoteLastUpdate);
          console.log("local", localLastUpdate);

          if (
            !forceUpdate &&
            remoteLastUpdate.getTime() > localLastUpdate.getTime()
          ) {
            //TODO: move this to a better ui
            const confirm = window.confirm(
              "Remote feed is newer than local. Do you want to overwrite local feed?",
            );
            console.error("date mismatcg");

            if (!confirm) {
              console.error("user canceled");
              return;
            }
          }
        } catch {
          (e) => {
            const confirmCreate = window.confirm(
              "Remote feed not reached do you want to create a new one?",
            );

            console.log("error", e);

            if (!confirmCreate) {
              console.error("user canceled");
              return;
            }
          };
        }

        const xml = serializeToXML(feed);

        const res = await invoke("s3_xml_upload", {
          payload: {
            content: xml,
            file_name: configuration.feed.filename,
            ...configuration.remotes.s3,
          },
        });

        console.log(res);
      } else {
        console.error("no remote", currentRemote);
        return;
      }
    }
  }

  function uploadCommand() {
    upload()
      .then(() => {
        console.log("upload done");
      })
      .catch((err) => {
        console.error(err);
      });
  }
  return <Button onClick={uploadCommand}>Force Update</Button>;
}
