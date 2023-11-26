import { Editor } from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import feedStore from "../../store/feed";
import { parseXML, serializeToXML } from "@fourviere/core/lib/converter";
import appStore from "../../store/app";
import { useDebounce } from "../../hooks/useDebounce";
import { useEffect, useState } from "react";

export default function SourceCode() {
  const { feedId } = useParams<{ feedId: string }>();
  const { addError } = appStore((state) => state);
  const [tempState, setTempState] = useState<string>();
  const debouncedValue = useDebounce<string | undefined>(tempState, 1500);

  if (!feedId) {
    return null;
  }
  const project = feedStore((state) => state.getProjectById(feedId));
  const xml = serializeToXML(project.feed);

  const setState = async (data: any) => {
    try {
      console.log("update state");
      const json = await parseXML(data);
      feedStore.getState().updateFeed(feedId, json);
    } catch (e) {
      console.log(e);
      addError("Invalid xml");
    }
  };

  useEffect(() => {
    if (!debouncedValue) {
      return;
    }
    console.log("debounced value", debouncedValue);
    setState(debouncedValue).then();
  }, [debouncedValue]);

  return (
    <Editor
      height="100vh"
      defaultLanguage="xml"
      theme="light"
      onChange={setTempState}
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
