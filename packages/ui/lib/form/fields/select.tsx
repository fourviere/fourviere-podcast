import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
// import classNames from "classnames";
// import { ClassAttributes, InputHTMLAttributes, FC } from "react";
// import { JSX } from "react/jsx-runtime";

import classNames from "classnames";
import React from "react";
import { FieldProps } from "formik";
import ErrorAlert from "../../alerts/error";
import { getError } from "../utils";

const STYLES = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl font-light",
  "2xl": "text-2xl font-light",
} as const;

const Select: React.ComponentType<
  FieldProps & {
    label: string;
    touched: boolean;
    options: Record<string, string>;
    style?: keyof typeof STYLES;
  }
> = ({ field, form, options, touched, style, ...props }) => {
  const error = getError({
    touched,
    errors: form?.errors,
    name: field?.name,
  });

  return (
    <div className="relative w-full">
      <ChevronUpDownIcon className="pointer-events-none absolute right-0 m-1.5 h-6 w-6 text-slate-400" />

      <select
        {...field}
        {...props}
        className={classNames(
          "focus:shadow-outline w-full appearance-none rounded-lg bg-slate-100 px-3 py-2 text-sm leading-tight focus:outline-none",
          style && STYLES[style],
        )}
      >
        {options &&
          Object.entries(options)?.map(([key, value]) => (
            <option value={key} key={key}>
              {value}
            </option>
          ))}
      </select>
      {error && <ErrorAlert message={error}></ErrorAlert>}
    </div>
  );
};

export default Select;
