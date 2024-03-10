import Alert from "@fourviere/ui/lib/dialogs/alert";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { ElementType, useState } from "react";
import { createPortal } from "react-dom";
import appStore from "../store/app";

const useConfirmationModal = () => {
  const [modal, setModal] = useState<
    | {
        title: string;
        message: string;
        ok: () => void;
        cancel: () => void;
        icon?: ElementType;
      }
    | false
  >(false);
  const { getTranslations } = appStore((state) => state);
  const t = getTranslations();

  const modals = document.getElementById("modals") as HTMLElement;

  async function askForConfirmation({
    title,
    message,
    icon,
  }: {
    title: string;
    message: string;
    icon?: ElementType;
  }) {
    return new Promise<boolean>((resolve) => {
      setModal({
        title,
        message,
        icon,
        ok: () => {
          setModal(false);
          resolve(true);
        },
        cancel: () => {
          setModal(false);
          resolve(false);
        },
      });
    });
  }

  function renderConfirmationModal() {
    return (
      <>
        {modal &&
          createPortal(
            <Alert
              icon={modal.icon ?? ExclamationTriangleIcon}
              title={modal.title}
              message={modal.message}
              okButton={t("modals.confirmation.ok")}
              cancelButton={t("modals.confirmation.cancel")}
              ok={modal.ok}
              cancel={modal.cancel}
            />,
            modals,
          )}
      </>
    );
  }

  return { askForConfirmation, renderConfirmationModal };
};

export default useConfirmationModal;
