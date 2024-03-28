import classNames from "classnames";
import React from "react";
import { FieldProps } from "formik";
import { getError, getTouchedByPath } from "../utils";
import ErrorAlert from "../../alerts/error";
import Button from "../../button";
import { v4 as uuidv4 } from "uuid";
import HStack from "../../layouts/h-stack";

const STYLES = {
  sm: "text-sm",
  base: "text-base",
  lg: "text-lg",
  xl: "text-xl font-light",
  "2xl": "text-2xl font-light",
} as const;

const Uuid: React.ComponentType<
  FieldProps & {
    label: string;
    // touched: boolean;
    style?: keyof typeof STYLES;
    fieldProps: Record<string, unknown>;
  } & React.InputHTMLAttributes<HTMLInputElement>
> = ({ field, form, style, fieldProps, ...props }) => {
  const touched = getTouchedByPath(form.touched, field.name);
  const error = getError({
    touched: touched,
    errors: form?.errors,
    name: field?.name,
  });

  return (
    <>
      <HStack spacing="2">
        <input
          {...field}
          {...props}
          {...fieldProps}
          className={classNames(
            "focus:shadow-outline w-full appearance-none rounded-lg bg-slate-100 px-3 py-2 leading-tight focus:outline-none",
            style ? STYLES[style as keyof typeof STYLES] : "text-sm",
          )}
        />
        <Button
          size={"sm"}
          theme="secondary"
          onClick={() => {
            form.setFieldValue(field.name, uuidv4());
          }}
        >
          #
        </Button>
      </HStack>

      {error && <ErrorAlert message={error}></ErrorAlert>}
    </>
  );
};
export default Uuid;
