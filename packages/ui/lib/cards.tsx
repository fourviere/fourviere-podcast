import React from "react";
import tw from "tailwind-styled-components";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";

const Sizes = {
  xs: "w-16 h-16",
  sm: "w-20 h-20",
  base: "w-24 h-24",
  lg: "w-32 h-32",
  xl: "w-48 h-48",
};

type Sizes = keyof typeof Sizes;

export function ImageLinkCard({
  src,
  showError,
  onClick,
  theme = "light",
  size = "base",
  faded = false,
  active = false,
}: {
  src: string;
  showError?: boolean;
  onClick?: () => void;
  theme: "dark" | "light";
  size?: Sizes;
  faded?: boolean;
  active?: boolean;
}) {
  return (
    <div className={`${Sizes[size]} relative`} onClick={onClick}>
      <img
        className={classNames(
          `rounded-lg ${Sizes[size]} object-cover hover:shadow-lg cursor-pointer hover:opacity-100 hover:border-4 hover:border-solid transition-all duration-200 ease-in-out`,
          {
            "border-slate-200 hover:border-slate-200":
              theme === "light" && !active,
            "border-slate-900 hover:border-slate-700":
              theme === "dark" && !active,
            "opacity-30": faded,
            "border-4 border-solid border-slate-200": active,
          }
        )}
        src={src}
      />
      {showError && (
        <div className="rounded-full bg-rose-600 absolute -top-1 -right-1 p-px ">
          <ExclamationCircleIcon className="h-5 text-white -mt-px" />
        </div>
      )}
    </div>
  );
}

export const ImageLinkCardContainer = tw.div`flex gap-2 flex-wrap`;
