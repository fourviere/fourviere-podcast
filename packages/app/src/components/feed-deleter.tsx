import Button from "@fourviere/ui/lib/button";
import UseCurrentFeed from "../hooks/use-current-feed";
import { TrashIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

import feedStore from "../store/feed";
import { useNavigate } from "react-router-dom";
import useConfirmationModal from "../hooks/use-confirmation-modal";

export default function FeedDeleter() {
  const currentFeed = UseCurrentFeed()!;

  const { t } = useTranslation("feed", {
    keyPrefix: "forms.configuration",
  });
  const { deleteProject } = feedStore((state) => state);
  const navigate = useNavigate();
  const { askForConfirmation, renderConfirmationModal } =
    useConfirmationModal();

  async function remove() {
    const del = await askForConfirmation({
      title: t("actions.fields.delete_feed.modalTitle"),
      message: t("actions.fields.delete_feed.modalMessage"),
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
        {t("actions.fields.delete_feed.label")}
      </Button>
    </>
  );
}
