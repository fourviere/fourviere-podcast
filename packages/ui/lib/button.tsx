import { ArrowPathIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
  Icon?: React.ElementType;
  isDisable?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  isDisable,
  className,
  size,
  Icon,
  ...rest
}) => {
  return (
    <button
      {...rest}
      className={classNames(
        `bg-slate-800 hover:bg-slate-600 rounded-lg hover:text-slate-200 font-semibold text-xs uppercase relative  text-white transition-all duration-200 ease-linear flex items-center`,
        { "pl-9": isLoading },
        { "py-2 px-3": size === "sm" },
        { "py-3 px-4": size === "md" },
        { "py-4 px-6": size === "lg" },
        { "opacity-50 cursor-not-allowed": isLoading },
        { "opacity-50 cursor-not-allowed": isDisable },
        className
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
