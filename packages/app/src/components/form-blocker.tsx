import Alert from "@fourviere/ui/lib/dialogs/alert";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useState, useEffect } from "react";
import { useBlocker } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { createPortal } from "react-dom";

const modals = document.getElementById("modals") as HTMLElement;

const FormBlocker = ({ dirty }: { dirty: boolean }) => {
  const [formIsDirty, setFormIsDirty] = useState(false);

  const { t } = useTranslation("", {
    keyPrefix: "",
  });

  useEffect(() => {
    setFormIsDirty(dirty);
  }, [dirty]);

  const blocker = useBlocker(formIsDirty);

  return createPortal(
    <>
      {blocker.state === "blocked" && (
        <Alert
          icon={ExclamationTriangleIcon}
          title={t("ui.forms.unsaved_changes.title")}
          message={t("ui.forms.unsaved_changes.message")}
          okButton={t("ui.forms.unsaved_changes.ok")}
          cancelButton={t("ui.forms.unsaved_changes.cancel")}
          ok={blocker.proceed.bind(blocker)}
          cancel={blocker.reset.bind(blocker)}
        />
      )}
    </>,
    modals,
  );
};

export default FormBlocker;
