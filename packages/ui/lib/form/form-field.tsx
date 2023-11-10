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
  initValue: unknown;
  as: React.ComponentType<any>;
  fieldProps?: Record<string, unknown>;
  postSlot?: React.ReactNode;
  overrideReset?: () => void;
  emtpyValueButtonMessage?: string;
} & FieldHookConfig<unknown>) {
  const Component = as;
  const [field, _, helpers] = useField(props);
  function reset() {
    helpers.setValue(undefined);
  }

  return (
    <div className="relative">
      {field.value ? (
        <div className="flex items-center space-x-1">
          <Component {...field} {...props} {...fieldProps} />
          <ResetField onClick={overrideReset || reset} />
          {postSlot}
        </div>
      ) : (
        <Undefined onClick={() => helpers.setValue(initValue)}>
          {emtpyValueButtonMessage}
        </Undefined>
      )}
    </div>
  );
}
