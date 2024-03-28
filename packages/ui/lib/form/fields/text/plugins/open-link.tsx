import { useEffect, useRef, useState } from "react";

import { createCommand, LexicalCommand } from "lexical";
import { computePosition } from "@floating-ui/dom";
import { LinkNode } from "@lexical/link";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { debounce } from "../../../../utils/debounce";
import Button from "../../../../button";
import { ClipboardIcon } from "@heroicons/react/24/outline";

type OpenLinkMenuPosition = { x: number; y: number } | undefined;

export const LINK_SELECTOR = `[data-lexical-editor] a`;
export const OPEN_LINK_MENU_ID = "open-link-menu";
export const TOGGLE_EDIT_LINK_MENU: LexicalCommand<undefined> = createCommand();

export function OpenLinkPlugin() {
  const ref = useRef<HTMLDivElement>(null);
  const linkSetRef = useRef<Set<string>>(new Set());

  const [copied, setCopied] = useState(false);
  const [width, setWidth] = useState<number | undefined>(undefined);
  const [pos, setPos] = useState<OpenLinkMenuPosition>(undefined);
  const [link, setLink] = useState<string | null>(null);

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const menu = (e.target as HTMLElement).closest<HTMLElement>(
        `#${OPEN_LINK_MENU_ID}`,
      );
      if (menu) return;

      const link = (e.target as HTMLElement).closest<HTMLElement>(
        LINK_SELECTOR,
      );

      if (!link || !ref.current) {
        setPos(undefined);
        setLink(null);
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      computePosition(link, ref.current, {
        placement: "bottom",
      })
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        .then((pos: { x: number; y: number }) => {
          setPos({ x: pos.x, y: pos.y + 10 });
          setLink(link.getAttribute("href"));
        })
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        .catch(() => {
          setPos(undefined);
        });
    };

    const debouncedMouseMove = debounce(handleMouseMove, 200);

    return editor.registerMutationListener(LinkNode, (mutations) => {
      for (const [key, type] of mutations) {
        switch (type) {
          case "created":
          case "updated":
            linkSetRef.current.add(key);
            if (linkSetRef.current.size === 1)
              document.addEventListener("mousemove", debouncedMouseMove);
            break;

          case "destroyed":
            linkSetRef.current.delete(key);
            if (linkSetRef.current.size === 0)
              document.removeEventListener("mousemove", debouncedMouseMove);
            break;
        }
      }
    });
  }, [editor, pos]);

  return (
    <div
      id={OPEN_LINK_MENU_ID}
      ref={ref}
      style={{ top: pos?.y, left: pos?.x, width }}
      aria-hidden={!pos?.x || !pos?.y}
      className={`absolute flex items-center justify-between gap-[2px] rounded-md bg-slate-100 p-1 shadow-lg ${
        pos?.x && pos.y ? "opacity-1 visible" : "invisible opacity-0"
      }`}
    >
      {link && !copied ? (
        <a
          className="cursor-pointer text-xs opacity-75"
          href={link}
          target="_blank"
          rel="noreferrer noopener"
        >
          {link}
        </a>
      ) : (
        <span className="w-full cursor-pointer text-center text-xs opacity-75">
          {copied ? "🎉 Copied!" : "No link"}
        </span>
      )}
      {link ? (
        <Button
          size="sm"
          Icon={ClipboardIcon}
          onClick={() => {
            navigator.clipboard.writeText(link);
            setCopied(true);
            setWidth(ref.current?.getBoundingClientRect().width);
            setTimeout(() => {
              setCopied(false);
              setWidth(undefined);
            }, 1000);
          }}
        />
      ) : undefined}
    </div>
  );
}
