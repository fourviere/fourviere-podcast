import Undefined from "@fourviere/ui/lib/form/fields/undefined";
import { FieldHookConfig, useField } from "formik";
import ResetField from "./reset-field";

export function FormField({
  initValue,
  as,
  fieldProps,
  overrideReset,
  postSlot,
  emtpyValueButtonMessage,
  ...props
}: {
  initValue?: unknown;
  as: React.ComponentType<unknown>;
  fieldProps?: Record<string, unknown>;
  postSlot?: React.ReactNode;
  overrideReset?: () => void;
  emtpyValueButtonMessage?: string;
} & FieldHookConfig<unknown>) {
  const Component = as;
  const [field, , helpers] = useField(props);
  function reset() {
    void helpers.setValue(undefined);
  }

  return (
    <div className="relative">
      {typeof field.value !== "undefined" || !emtpyValueButtonMessage ? (
        <div className="flex items-center space-x-1">
          <Component {...field} {...props} {...fieldProps} />
          {initValue ? <ResetField onClick={overrideReset || reset} /> : null}
          {postSlot}
        </div>
      ) : initValue ? (
        <Undefined onClick={() => void helpers.setValue(initValue)}>
          {emtpyValueButtonMessage}
        </Undefined>
      ) : null}
    </div>
  );
}
