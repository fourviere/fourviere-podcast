import { FunctionComponent, PropsWithChildren } from "react";
import DragArea from "@fourviere/ui/lib/form/dragArea";
import useTauriDragArea from "../../hooks/useTauriDragArea";
import { readFile } from "../../native/fs";
import feedStore from "../../store/feed";

interface StartByDragProps {}
const StartByDrag: FunctionComponent<PropsWithChildren<StartByDragProps>> = ({
  children,
}) => {
  const { loadFeedFromFileContents } = feedStore((state) => state);
  const { isHover, error } = useTauriDragArea({
    onFile: (file) => {
      void onDrop(file);
    },
    onError: (error) => {
      console.error(error);
    },
    fileExtensions: ["xml", "rss"],
  });

  async function onDrop(file: string) {
    const content = await readFile(file);
    if (!content) {
      return;
    }
    loadFeedFromFileContents(content);
  }

  return (
    <DragArea isHover={isHover} error={error}>
      {children}
    </DragArea>
  );
};

export default StartByDrag;
