import { Editor, useMonaco } from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import feedStore from "../../../store/feed/index";
import { parseXML, serializeToXML } from "@fourviere/core/lib/converter";
import appStore from "../../../store/app";
import { useEffect, useLayoutEffect, useState } from "react";
import ContainerTitle from "@fourviere/ui/lib/container-title";
import { useTranslation } from "react-i18next";
import VStack from "@fourviere/ui/lib/layouts/v-stack";

export default function SourceCode() {
  const { feedId } = useParams<{ feedId: string }>();
  const { addError } = appStore((state) => state);
  const [tempState, setTempState] = useState<string>();
  const [isDirty, setIsDirty] = useState<boolean>();
  const monaco = useMonaco();
  const { t } = useTranslation("", {
    keyPrefix: "",
  });
  const { t: tUtils } = useTranslation("utils", { keyPrefix: "" });

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

  useLayoutEffect(() => {
    // do conditional chaining
    monaco?.editor.defineTheme("fourviere-io", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.foreground": "#e2e8f0",
        "editor.background": "#0f172a",
        "editor.selectionBackground": "#334155",
        "editor.lineHighlightBackground": "#1e293b",
        "editorCursor.foreground": "#D8DEE9",
        "editorWhitespace.foreground": "#434C5ECC",
      },
    });
    // or make sure that it exists by other ways
  }, [monaco]);

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
    <VStack wFull hFull>
      <ContainerTitle
        labels={{
          isSaving: tUtils("form.labels.isSaving"),
          save: tUtils("form.labels.save"),
          unsavedChanges: tUtils("form.labels.unsavedChanges"),
        }}
        isDirty={isDirty}
        isSubmitting={false}
        onSave={() => {
          void setState();
        }}
      >
        {t("edit_feed.channel_field.itunes.title")}
      </ContainerTitle>

      <Editor
        height="100%"
        defaultLanguage="xml"
        theme="fourviere-io"
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
    </VStack>
  );
}
