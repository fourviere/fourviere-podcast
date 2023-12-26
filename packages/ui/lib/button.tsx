import { ArrowPathIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
  Icon?: React.ElementType;
  isDisable?: boolean;
  wfull?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  isDisable,
  className,
  size,
  Icon,
  wfull,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={classNames(
        `relative flex items-center rounded-lg bg-slate-800 text-xs font-semibold uppercase text-white transition-all duration-200 ease-linear hover:bg-slate-600 hover:text-slate-200`,
        { "pl-9": isLoading },
        { "px-3 py-2": size === "sm" },
        { "px-4 py-3": size === "md" },
        { "px-6 py-4": size === "lg" },
        { "cursor-not-allowed opacity-50": isLoading },
        { "cursor-not-allowed opacity-50": isDisable },
        { "flex w-full justify-center": wfull },
        className,
      )}
    >
      {isLoading ? (
        <div className="absolute inset-y-0 left-0 flex h-7 w-7 flex-col justify-center pl-3">
          <ArrowPathIcon className="h-4 w-4 animate-spin text-slate-100" />
        </div>
      ) : null}
      {Icon && <Icon className="w-3 text-slate-50" />}
      {children}
    </button>
  );
};

export default Button;
