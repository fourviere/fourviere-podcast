import { FunctionComponent, PropsWithChildren } from "react";
//import feedStore from "../../store/feed";
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
      readFile(file).then((content) => {
        if (!content) {
          return;
        }
        loadFeedFromFileContents(content);
      });
    },
    onError: (error) => {
      console.error(error);
    },
    fileExtensions: ["xml", "rss"],
  });

  return (
    <DragArea isHover={isHover} error={error}>
      {children}
    </DragArea>
  );
};

export default StartByDrag;
