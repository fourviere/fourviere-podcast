import React from "react";
import Undefined from "@fourviere/ui/lib/form/fields/undefined";
import { FieldHookConfig, useField } from "formik";
import ResetField from "./reset-field";

export function FormField({
  initValue,
  as,
  fieldProps,
  overrideReset,
  postSlot,
  ...props
}: {
  initValue: unknown;
  as: React.ComponentType;
  fieldProps?: Record<string, unknown>;
  postSlot?: React.ReactNode;
  overrideReset?: () => void;
} & FieldHookConfig<unknown>) {
  const Component = as;
  const [field, meta, helpers] = useField(props);
  function reset() {
    helpers.setValue(undefined);
  }

  return (
    <div className="relative">
      {field.value ? (
        <div className="flex items-center space-x-2">
          <Component {...field} {...props} {...fieldProps} />
          <ResetField onClick={overrideReset || reset} />
          {postSlot}
        </div>
      ) : (
        <Undefined onClick={() => helpers.setValue(initValue)}></Undefined>
      )}
    </div>
  );
}
