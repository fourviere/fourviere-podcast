import { Editor } from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import feedStore from "../../store/feed";
import { parseXML, serializeToXML } from "@fourviere/core/lib/converter";
import debounce from "debounce";
import appStore from "../../store/app";

export default function SourceCode() {
  const { feedId } = useParams<{ feedId: string }>();
  const { addError } = appStore((state) => state);

  if (!feedId) {
    return null;
  }
  const project = feedStore((state) => state.getProjectById(feedId));
  const xml = serializeToXML(project.feed);

  const debouncedFunction = debounce(async (data: any) => {
    try {
      console.log("update state");
      const json = await parseXML(data);
      feedStore.getState().updateFeed(feedId, json);
    } catch (e) {
      console.log(e);
      addError("Invalid xml");
    }
  }, 1000);

  async function updateFeed(data: any) {
    console.log("b");
    await debouncedFunction(data);
  }

  return (
    <Editor
      height="100vh"
      defaultLanguage="xml"
      theme="light"
      onChange={updateFeed}
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
