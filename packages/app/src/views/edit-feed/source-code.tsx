import { Editor } from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import feedStore from "../../store/feed";
import { serializeToXML } from "@fourviere/core/lib/converter";

export default function SourceCode() {
  const { feedId } = useParams<{ feedId: string }>();
  if (!feedId) {
    return null;
  }
  const project = feedStore((state) => state.getProjectById(feedId));
  const xml = serializeToXML(project.feed);
  return (
    <Editor
      height="100vh"
      defaultLanguage="xml"
      theme="light"
      onChange={(e) => console.log(e)}
      value={xml}
      options={{
        minimap: {
          enabled: false,
        },
        cursorStyle: "block",
        wordWrap: "on",
      }}
    />
  );
}
