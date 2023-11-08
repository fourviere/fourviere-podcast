import React from "react";
import Undefined from "@fourviere/ui/lib/form/fields/undefined";
import { useField } from "formik";
import ResetField from "./reset-field";
export function FormField({ label, initValue, as, ...props }: any) {
  const Component = as;
  const [field, meta, helpers] = useField(props);
  function reset() {
    helpers.setValue(undefined);
  }

  return (
    <div className="relative">
      {field.value ? (
        <Component {...field} {...props} />
      ) : (
        <Undefined onClick={() => helpers.setValue(initValue)}></Undefined>
      )}
      <ResetField onClick={reset} />
    </div>
  );
}
