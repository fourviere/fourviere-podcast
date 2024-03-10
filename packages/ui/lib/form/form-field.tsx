import Undefined from "@fourviere/ui/lib/form/fields/undefined";
import { useField } from "formik";
import ResetField from "./reset-field";

export function FormField<A>({
  initValue,
  id,
  as,
  name,
  fieldProps,
  overrideReset,
  postSlot,
  emtpyValueButtonMessage,
}: {
  initValue?: unknown;
  as: A;
  id: string;
  name: string;
  fieldProps?: Record<string, unknown>;
  postSlot?: React.ReactNode;
  overrideReset?: () => void;
  emtpyValueButtonMessage?: string;
}) {
  const Component = as as React.ElementType;
  const [field, value, helpers] = useField(name);
  function reset() {
    void helpers.setValue(undefined);
  }

  return (
    <div className="relative">
      {typeof field.value !== "undefined" || !emtpyValueButtonMessage ? (
        <div className="flex items-center space-x-1">
          <Component
            id={id}
            name={name}
            value={value}
            {...field}
            {...fieldProps}
          />
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
