import Button from "@fourviere/ui/lib/button";
import UseCurrentFeed from "../hooks/use-current-feed";
import { TrashIcon } from "@heroicons/react/24/outline";
import appStore from "../store/app";
import feedStore from "../store/feed";
import { useNavigate } from "react-router-dom";
import useConfirmationModal from "../hooks/use-confirmation-modal";

export default function FeedDeleter() {
  const currentFeed = UseCurrentFeed()!;

  const { getTranslations } = appStore((state) => state);
  const t = getTranslations();
  const { deleteProject } = feedStore((state) => state);
  const navigate = useNavigate();
  const { askForConfirmation, renderConfirmationModal } =
    useConfirmationModal();

  async function remove() {
    const del = await askForConfirmation({
      title: t("edit_feed.feed-deleter.ask_delete.title"),
      message: t("edit_feed.feed-deleter.ask_delete"),
    });

    if (del) {
      navigate("/");
      deleteProject(currentFeed.feedId!);
    }
  }

  return (
    <>
      {renderConfirmationModal()}

      <Button
        size="lg"
        theme="warning"
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={remove}
        Icon={TrashIcon}
      >
        {t("edit_feed.feed-deleter.button_label")}
      </Button>
    </>
  );
}
