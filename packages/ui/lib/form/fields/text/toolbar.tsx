import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  ListNode,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { useCallback, useState } from "react";
import {
  ArrowUturnLeftIcon,
  ArrowUturnRightIcon,
  LinkIcon,
  ListBulletIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";
import { $getSelection } from "lexical";
import { useEffect } from "react";
import classNames from "classnames";
import { TOGGLE_EDIT_LINK_MENU } from "./plugins/edit-link-plugin";

const LowPriority = 1;

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isOrderedList, setIsOrderedList] = useState(false);
  const [isUnorderedList, setIsUnorderedList] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsOrderedList(
        selection
          .getNodes()[0]
          ?.getParents()
          .some(
            (node: ListNode) =>
              node.getType() === "list" && node?.getTag() === "ol",
          ),
      );
      setIsUnorderedList(
        selection
          .getNodes()[0]
          ?.getParents()
          .some(
            (node: ListNode) =>
              node.getType() === "list" && node?.getTag() === "ul",
          ),
      );
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateToolbar]);

  return (
    <div className="mb-3 flex w-full space-x-3">
      <div className="flex space-x-[1px] overflow-hidden rounded-md">
        <button
          type="button"
          disabled={!canUndo}
          onClick={() => {
            editor.dispatchCommand(UNDO_COMMAND, undefined);
          }}
          aria-label="Undo"
          className="cursor-pointer bg-white p-3 hover:bg-slate-50"
        >
          <ArrowUturnLeftIcon
            className={classNames("h-4 w-4 text-slate-800", {
              "text-slate-300": !canUndo,
            })}
          />
        </button>
        <button
          disabled={!canRedo}
          onClick={() => {
            editor.dispatchCommand(REDO_COMMAND, undefined);
          }}
          aria-label="Undo"
          className="cursor-pointer bg-white p-3 hover:bg-slate-50"
        >
          <ArrowUturnRightIcon
            className={classNames("h-4 w-4 text-slate-800", {
              "text-slate-300": !canRedo,
            })}
          />
        </button>
      </div>

      <div className="flex space-x-[1px] overflow-hidden rounded-md">
        <button
          type="button"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
          }}
          className={classNames(
            "w-10 cursor-pointer  p-3  uppercase hover:bg-slate-50 ",
            {
              "bg-slate-200 font-semibold": isBold,
              "bg-white": !isBold,
            },
          )}
          aria-label="Format Bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => {
            editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
          }}
          className={classNames(
            "w-10 cursor-pointer rounded-r-lg p-3 uppercase transition-all duration-500 hover:bg-slate-50 ",
            {
              "bg-slate-200 italic": isItalic,
              "bg-white": !isItalic,
            },
          )}
          aria-label="Format Italics"
        >
          I
        </button>
      </div>

      <div className="flex space-x-[1px] overflow-hidden rounded-md">
        <button
          onClick={() => {
            if (!isUnorderedList) {
              editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
            } else {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            }
          }}
          className={classNames(
            "w-10 cursor-pointer  p-3  uppercase hover:bg-slate-50 ",
            {
              "bg-slate-200 font-semibold": isUnorderedList,
              "bg-white": !isUnorderedList,
            },
          )}
          aria-label="Format Bold"
        >
          <ListBulletIcon />
        </button>
        <button
          onClick={() => {
            if (!isOrderedList) {
              editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
            } else {
              editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
            }
          }}
          className={classNames(
            "w-10 cursor-pointer rounded-r-lg p-3 uppercase transition-all duration-500 hover:bg-slate-50 ",
            {
              "bg-slate-200 italic": isOrderedList,
              "bg-white": !isOrderedList,
            },
          )}
          aria-label="Format Italics"
        >
          <QueueListIcon />
        </button>
      </div>

      <div className="flex space-x-[1px] overflow-hidden rounded-md">
        <button
          type="button"
          onClick={() => {
            editor.dispatchCommand(TOGGLE_EDIT_LINK_MENU, undefined);
          }}
          className={
            "w-10 cursor-pointer rounded-r-lg bg-white p-3 uppercase transition-all duration-500 hover:bg-slate-50"
          }
          aria-label="Link"
        >
          <LinkIcon />
        </button>
      </div>
    </div>
  );
}
