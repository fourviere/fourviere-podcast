import React from "react";
import tw from "tailwind-styled-components";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

export function ImageLinkCard({
  src,
  showError,
  onClick,
}: {
  src: string;
  showError?: boolean;
  onClick?: () => void;
}) {
  return (
    <div className="w-24 h-24 relative" onClick={onClick}>
      <img
        className="rounded-lg w-24 h-24 object-cover hover:shadow-lg cursor-pointer border hover:border-4 hover:border-solid hover:border-slate-200 transition-all duration-200 ease-in-out"
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
