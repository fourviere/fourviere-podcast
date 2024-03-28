import { useCallback, useEffect, useRef, useState } from "react";
import { LinkNode } from "@lexical/link";
import {
  $getSelection,
  COMMAND_PRIORITY_LOW,
  createCommand,
  LexicalCommand,
} from "lexical";
import { TOGGLE_LINK_COMMAND } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { computePosition } from "@floating-ui/dom";
import { $isLinkNode } from "@lexical/link";
import type { EditorState, ElementNode } from "lexical";
import Button from "../../../../button";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useClickOutside } from "../../../../hooks/use-click-outside";

type EditLinkMenuPosition = { x: number; y: number } | undefined;

export const TOGGLE_EDIT_LINK_MENU: LexicalCommand<undefined> = createCommand();

/**
 * Check if all nodes in the selection share the same link target.
 * If so, return the link target, otherwise return undefined.
 */

export function $getSharedLinkTarget(
  selection?: EditorState["_selection"],
): string | undefined {
  const nodes = selection?.getNodes();
  if (!nodes?.length) return undefined;

  const sharedLinkTarget = nodes.every((node, i, arr) => {
    const parent = node.getParent<ElementNode>();
    if (!$isLinkNode(parent)) return false;

    const linkTarget = parent.getURL();
    const prevLinkTarget = arr[i - 1]?.getParent<LinkNode>()?.getURL();

    return i > 0 ? linkTarget === prevLinkTarget : true;
  });

  return sharedLinkTarget
    ? nodes[0].getParent<LinkNode>()?.getURL()
    : undefined;
}

export function EditLinkPlugin() {
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [value, setValue] = useState("");
  const [error, setError] = useState(false);
  const [pos, setPos] = useState<EditLinkMenuPosition>(undefined);
  const [hasLink, setHasLink] = useState(false);

  const [editor] = useLexicalComposerContext();

  const resetState = useCallback(
    (focus: boolean) => {
      setValue("");
      setError(false);
      setPos(undefined);
      focus && editor.focus();
    },
    [editor],
  );

  useEffect(() => {
    return editor.registerCommand(
      TOGGLE_EDIT_LINK_MENU,
      () => {
        const nativeSel = window.getSelection();
        const isCollapsed =
          nativeSel?.rangeCount === 0 || nativeSel?.isCollapsed;

        if (!!pos?.x || !!pos?.y || !ref.current || !nativeSel || isCollapsed) {
          resetState(true);
          return false;
        }

        const domRange = nativeSel.getRangeAt(0);

        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        computePosition(domRange, ref.current, {
          placement: "bottom",
        })
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          .then((pos: EditLinkMenuPosition) => {
            if (pos) {
              setPos({ x: pos.x, y: pos.y + 10 });
            }
            editor.getEditorState().read(() => {
              const selection = $getSelection();
              const linkTarget = $getSharedLinkTarget(selection);
              setHasLink(!!linkTarget);
            });
          })
          //  eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          .catch(() => {
            resetState(true);
          });

        return true;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor, pos, resetState]);

  useEffect(() => {
    console.log("EditLinkPlugin useEffect 2");
    if (pos?.x && pos?.y) {
      let initialUrl = "";

      editor.getEditorState().read(() => {
        const selection = $getSelection();
        initialUrl = $getSharedLinkTarget(selection) ?? "";
      });

      setValue(initialUrl);
      inputRef.current?.focus();
    }
  }, [pos, editor]);

  useClickOutside(ref, () => {
    resetState(false);
  });

  const handleSetLink = () => {
    if (!value) return;

    const isLinkSet = editor.dispatchCommand(TOGGLE_LINK_COMMAND, {
      url: value,
      target: "_blank",
    });

    if (isLinkSet) resetState(true);
    else setError(true);
  };

  const handleRemoveLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    resetState(true);
  };

  return (
    <>
      <div
        ref={ref}
        style={{ top: pos?.y, left: pos?.x }}
        aria-hidden={!pos?.x || !pos?.y}
        className={`absolute flex items-center justify-between bg-slate-100 shadow-lg ${
          error ? "text-rose-600" : ""
        } gap-1 rounded-md p-1 ${
          pos?.x && pos.y ? "opacity-1 visible" : "invisible opacity-0"
        }`}
      >
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="border-none bg-transparent px-2 py-1 text-xs outline-none"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSetLink();
              return;
            }

            if (e.key === "Escape") {
              e.preventDefault();
              resetState(true);
              return;
            }
          }}
        />
        {hasLink ? (
          <Button size="sm" Icon={TrashIcon} onClick={handleRemoveLink} />
        ) : null}
        <Button
          size="sm"
          Icon={CheckIcon}
          disabled={!value}
          onClick={handleSetLink}
        />
      </div>
    </>
  );
}
