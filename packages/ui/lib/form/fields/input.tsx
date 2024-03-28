import classNames from "classnames";
import React, { InputHTMLAttributes } from "react";
import { FieldProps } from "formik";
import { getError, getTouchedByPath } from "../utils";
import ErrorAlert from "../../alerts/error";

const STYLES = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl font-light",
  "2xl": "text-2xl font-light",
} as const;

const Input: React.ComponentType<
  FieldProps & {
    label: string;
    // touched: boolean;
    style?: keyof typeof STYLES;
    type?: "text" | "password" | "number" | "email";
    fieldProps: Record<string, unknown>;
  } & React.InputHTMLAttributes<HTMLInputElement>
> = ({ field, form, style, type, fieldProps, ...props }) => {
  const touched = getTouchedByPath(form.touched, field.name);
  const error = getError({
    touched: touched,
    errors: form?.errors,
    name: field?.name,
  });

  return (
    <>
      <input
        type={type ?? "text"}
        {...field}
        {...props}
        {...fieldProps}
        className={classNames(
          "focus:shadow-outline w-full appearance-none rounded-lg bg-slate-100 px-3 py-2 leading-tight focus:outline-none",
          style ? STYLES[style as keyof typeof STYLES] : "text-sm",
        )}
      />

      {error && <ErrorAlert message={error}></ErrorAlert>}
    </>
  );
};
export default Input;

export const InputRaw = ({
  componentStyle,
  ...props
}: InputHTMLAttributes<unknown> & {
  componentStyle?: keyof typeof STYLES;
}) => (
  <input
    {...props}
    className={classNames(
      "focus:shadow-outline w-full appearance-none rounded-lg bg-slate-100 px-3 py-2 leading-tight focus:outline-none",
      componentStyle ? STYLES[componentStyle as keyof typeof STYLES] : "",
    )}
  />
);
