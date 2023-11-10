import React from "react";
import Undefined from "@fourviere/ui/lib/form/fields/undefined";
import { FieldHookConfig, useField } from "formik";
import ResetField from "./reset-field";

export function FormField({
  initValue,
  as,
  fieldProps,
  ...props
}: {
  initValue: unknown;
  as: React.ComponentType;
  fieldProps?: Record<string, unknown>;
} & FieldHookConfig<unknown>) {
  const Component = as;
  const [field, meta, helpers] = useField(props);
  function reset() {
    helpers.setValue(undefined);
  }

  return (
    <div className="relative">
      {field.value ? (
        <div className="mr-[24px]">
          <Component {...field} {...props} {...fieldProps} />
          <ResetField onClick={reset} />
        </div>
      ) : (
        <Undefined onClick={() => helpers.setValue(initValue)}></Undefined>
      )}
    </div>
  );
}
