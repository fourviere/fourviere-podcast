import { Editor } from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import feedStore from "../../store/feed/index";
import { parseXML, serializeToXML } from "@fourviere/core/lib/converter";
import appStore from "../../store/app";
import { useEffect, useState } from "react";
import { Container } from "@fourviere/ui/lib/box";
import ContainerTitle from "@fourviere/ui/lib/container-title";
import useTranslations from "../../hooks/use-translations";

export default function SourceCode() {
  const { feedId } = useParams<{ feedId: string }>();
  const { addError } = appStore((state) => state);
  const [tempState, setTempState] = useState<string>();
  const [isDirty, setIsDirty] = useState<boolean>();
  const t = useTranslations();

  if (!feedId) {
    return null;
  }
  const project = feedStore((state) => state.getProjectById(feedId));
  const xml = serializeToXML(project.feed);

  useEffect(() => {
    setTempState(xml);
  }, []);

  useEffect(() => {
    if (tempState !== xml && tempState !== undefined) {
      setIsDirty(true);
    }
  }, [tempState]);

  const setState = () => {
    try {
      if (!tempState) {
        return;
      }
      const json = parseXML(tempState);
      feedStore.getState().updateFeed(feedId, json);
      setIsDirty(false);
    } catch (e) {
      console.log(e);
      addError("Invalid xml");
    }
  };

  return (
    <Container wFull flex="col">
      <ContainerTitle
        isDirty={isDirty}
        isSubmitting={false}
        onSave={() => {
          void setState();
        }}
      >
        {t["edit_feed.channel_field.itunes.title"]}
      </ContainerTitle>

      <Editor
        height="100%"
        defaultLanguage="xml"
        theme="vs-dark"
        onChange={setTempState}
        value={xml}
        options={{
          minimap: {
            enabled: true,
          },
          cursorStyle: "block",
          wordWrap: "on",
          scrollBeyondLastLine: false,
        }}
      />
    </Container>
  );
}
