import Button from "@fourviere/ui/lib/button";
import { confirm } from "@tauri-apps/api/dialog";
import UseCurrentFeed from "../hooks/use-current-feed";
import { TrashIcon } from "@heroicons/react/24/outline";
import appStore from "../store/app";
import feedStore from "../store/feed";
import { redirect } from "react-router-dom";

export default function FeedDeleter() {
  const currentFeed = UseCurrentFeed()!;

  const { getTranslations } = appStore((state) => state);
  const t = getTranslations();
  const { deleteProject } = feedStore((state) => state);

  async function askForDelete() {
    return await confirm(t["edit_feed.feed-deleter.ask_delete"], {
      title: t["edit_feed.feed-deleter.ask_delete.title"],
      type: "warning",
    });
  }

  async function remove() {
    const del = await askForDelete();
    if (del) {
      redirect("/");
      deleteProject(currentFeed.feedId!);
    }
  }

  return (
    <Button
      size="lg"
      theme="warning"
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      onClick={() => remove()}
      Icon={TrashIcon}
    >
      {t["edit_feed.feed-deleter.button_label"]}
    </Button>
  );
}
