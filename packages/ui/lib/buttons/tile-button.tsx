import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";
import classNames from "classnames";
import React from "react";
import MicroCircular from "../progress/micro-circular";
import { PencilIcon } from "@heroicons/react/24/outline";

const THEMES = {
  normal: "border-slate-200 bg-white text-slate-600 hover:border-slate-400",
  success: "border-lime-500 text-lime-500 hover:border-lime-600",
  error: "border-rose-400 text-rose-400 hover:border-rose-600 bg-rose-50",
  disabled: "bg-white border-slate-200 text-slate-400 opacity-80",
  empty: "border-slate-200 bg-white text-slate-400 border-dashed",
};

interface TileButtonProps {
  icon: React.ElementType;
  title: string;
  theme?: keyof typeof THEMES;
  checked?: boolean;
  error?: boolean;
  label?: string;
  loading?: number;
  onClick?: () => void;
}

const TileButton = ({
  icon,
  title,
  theme,
  checked,
  error,
  label,
  loading,
  onClick,
  ...props
}: TileButtonProps) => {
  // Implement your component logic here
  const Icon = icon;
  return (
    <button
      onClick={onClick}
      {...props}
      className={classNames({
        "group relative flex h-16 flex-col items-center justify-center overflow-hidden rounded-lg border  transition-all duration-500 ":
          true,
        [THEMES[theme ?? "normal"]]: true,
        "cursor-not-allowed": theme === "disabled",
      })}
    >
      {checked && (
        <CheckCircleIcon className="absolute right-px top-px h-4 w-4 transition-all duration-500 group-hover:h-3.5" />
      )}
      {!!error && (
        <ExclamationTriangleIcon className="absolute right-[2px] top-[2px] h-4 w-4 transition-all duration-500 group-hover:h-3.5" />
      )}
      {!!label && (
        <div className="text-2xs absolute w-full rotate-45 whitespace-nowrap bg-slate-600/80 px-2 font-bold uppercase leading-none  text-white transition-all duration-500 group-hover:translate-x-2">
          {label}
        </div>
      )}
      {theme !== "disabled" && (
        <div className="absolute bottom-0 left-0 right-0 top-0 grid place-items-center opacity-0 transition-all duration-500 group-hover:opacity-100">
          <div className="rounded-full bg-slate-600 p-2 text-slate-50">
            <PencilIcon className="h-3 w-3" />
          </div>
        </div>
      )}
      {typeof loading !== "undefined" && (
        <MicroCircular
          className="m-0! absolute right-px top-px transition-all duration-500"
          value={loading}
          radius={6}
          strokeWidth={1.5}
        />
      )}
      <div
        className={classNames(
          {
            "group-hover:scale-[.96] group-hover:opacity-30":
              theme !== "disabled",
          },
          "flex flex-col items-center justify-center transition-all duration-500",
        )}
      >
        <Icon className="mb-1 h-6 w-6" />
        <div className="text-2xs whitespace-break-all mx-1 line-clamp-1 break-all font-bold uppercase leading-none group-hover:line-clamp-3">
          {title}
        </div>
      </div>
    </button>
  );
};

export default TileButton;
