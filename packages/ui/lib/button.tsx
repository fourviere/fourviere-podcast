import { ArrowPathIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  size?: "sm" | "md" | "lg";
  Icon?: React.ElementType;
  isDisabled?: boolean;
  type?: "button" | "submit" | "reset";
  wfull?: boolean;
  theme?: "primary" | "secondary" | "tertiary" | "warning";
  responsiveCollapse?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  isLoading,
  isDisabled,
  className,
  size,
  Icon,
  wfull,
  theme = "primary",
  type = "button",
  responsiveCollapse = false,
  ...rest
}) => {
  return (
    <button
      {...rest}
      type={type}
      className={classNames(
        `button`,
        { "is-loading": isLoading },
        { "is-disabled": isDisabled },
        { "is-fullwidth": !!wfull },
        theme,
        className,
      )}
    >
      <div className={classNames("content", size)}>
        {isLoading ? <ArrowPathIcon className="h-4 w-4 animate-spin" /> : null}

        {Icon && !isLoading && <Icon className="h-4 text-slate-50" />}

        {children && (
          <span className={classNames({ collapsable: responsiveCollapse })}>
            {children}
          </span>
        )}
      </div>
    </button>
  );
};

export default Button;
