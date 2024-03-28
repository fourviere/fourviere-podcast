import classNames from "classnames";
import React, { useEffect, useRef } from "react";
import { FieldProps } from "formik";
import { getError, getTouchedByPath } from "../../utils";
import ErrorAlert from "../../../alerts/error";
import { $getRoot, $insertNodes, $setSelection } from "lexical";
import { useLayoutEffect } from "react";
import { isValidUrl } from "../../../utils/url";
import { CodeNode } from "@lexical/code";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListItemNode, ListNode } from "@lexical/list";
import { LinkNode, AutoLinkNode } from "@lexical/link";
import { $generateNodesFromDOM, $generateHtmlFromNodes } from "@lexical/html";
import { ToolbarPlugin } from "./toolbar";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { OpenLinkPlugin } from "./plugins/open-link";
import { AutoLinkPlugin } from "./plugins/autolink";
import { EditLinkPlugin } from "./plugins/edit-link-plugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";

const initialConfig = {
  namespace: "editor",
  theme: {},
  onError: console.error,
  nodes: [
    ListItemNode,
    AutoLinkNode,
    CodeNode,
    ListNode,
    LinkNode,
    HeadingNode,
    QuoteNode,
  ],
  plugins: [AutoFocusPlugin, RichTextPlugin, HistoryPlugin, ListPlugin],
};

const Input: React.ComponentType<
  FieldProps & {
    label: string;
    fieldProps: Record<string, unknown>;
  } & React.InputHTMLAttributes<HTMLInputElement>
> = ({ field, form }) => {
  const touched = getTouchedByPath(form.touched, field.name);
  const ref = useRef<HTMLDivElement>(null);
  const error = getError({
    touched: touched,
    errors: form?.errors,
    name: field?.name,
  });

  return (
    <>
      <div
        className={classNames(
          "focus:shadow-outline relative w-full appearance-none rounded-lg bg-slate-100 p-3 leading-tight ",
        )}
      >
        <LexicalComposer initialConfig={initialConfig}>
          <ToolbarPlugin />
          <div
            ref={ref}
            className="flex max-h-[400px] min-h-[300px] w-full justify-center overflow-y-auto  rounded-md bg-white p-3"
          >
            <RichTextPlugin
              placeholder={null}
              contentEditable={
                <ContentEditable className="prose w-full font-serif text-sm focus:outline-none"></ContentEditable>
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>

          <HistoryPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <ListPlugin />
          <LinkPlugin validateUrl={isValidUrl} />

          <AutoLinkPlugin />
          <EditLinkPlugin />
          <OpenLinkPlugin />
          <OnChangePlugin
            ignoreSelectionChange={true}
            onChange={(_, editor) => {
              editor.update(() => {
                const rawHTML = $generateHtmlFromNodes(editor, null);
                form.setFieldValue(field.name, rawHTML);
                console.log("onChange", rawHTML);
              });
            }}
          />
          <LinkPlugin />
          <InitialData value={field.value as string} />
        </LexicalComposer>
      </div>

      {error && <ErrorAlert message={error}></ErrorAlert>}
    </>
  );
};
export default Input;

function InitialData({ value }: { value: string }) {
  const [editor] = useLexicalComposerContext();
  useLayoutEffect(() => {
    editor.update(() => {
      // In the browser you can use the native DOMParser API to parse the HTML string.
      // editor.setEditable(false);
      const parser = new DOMParser();
      const dom = parser.parseFromString(value, "text/html");

      // Once you have the DOM instance it's easy to generate LexicalNodes.
      const nodes = $generateNodesFromDOM(editor, dom);

      // Select the root
      $getRoot().clear();
      $getRoot().select();
      // Insert them at a selection.
      $insertNodes(nodes);

      // editor.setEditable(true);
    });
  }, []);

  useEffect(() => {
    editor.update(() => {
      $setSelection(null);
    });
  }, []);

  return null;
}
