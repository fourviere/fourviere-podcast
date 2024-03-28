import { FunctionComponent, PropsWithChildren } from "react";
import DragArea from "@fourviere/ui/lib/form/dragArea";
import useTauriDragArea from "../../hooks/use-tauri-drag-area";
import { readFile } from "../../native/fs";
import feedStore from "../../store/feed/index";
import appStore from "../../store/app";
import { useTranslation } from "react-i18next";

interface StartByDragProps {}
const StartByDrag: FunctionComponent<PropsWithChildren<StartByDragProps>> = ({
  children,
}) => {
  const { initProjectFromFileContents } = feedStore((state) => state);
  const { t } = useTranslation("start");
  const { addError } = appStore((state) => state);
  const { isHover, error } = useTauriDragArea({
    onFile: (file) => {
      void onDrop(file);
    },
    onError: () => {
      addError(t("errors.invalid_xml"));
    },
    fileExtensions: ["xml", "rss"],
  });

  async function onDrop(file: string) {
    const content = await readFile(file);
    if (!content) {
      return;
    }
    try {
      initProjectFromFileContents(content);
    } catch (e) {
      addError(t("errors.invalid_xml"));
    }
  }

  return (
    <DragArea isHover={isHover} error={error}>
      {children}
    </DragArea>
  );
};

export default StartByDrag;
