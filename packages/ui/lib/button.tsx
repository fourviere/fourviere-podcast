import { ArrowPathIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

const Button: React.FC<ButtonProps> = ({ children, isLoading, ...rest }) => {
  return (
    <button
      {...rest}
      className={classNames(
        `bg-slate-800 hover:bg-slate-600 rounded-lg hover:text-slate-200 font-semibold text-xs uppercase relative py-4 px-6 text-white transition-all duration-200 ease-linear flex items-center`,
        { "pl-9": isLoading }
      )}
    >
      {isLoading ? (
        <div className="absolute w-7 h-7 pl-3 left-0 top-0 bottom-0 flex flex-col justify-center">
          <ArrowPathIcon className="w-4 h-4 text-slate-100 animate-spin" />
        </div>
      ) : null}
      {children}
    </button>
  );
};

export default Button;
