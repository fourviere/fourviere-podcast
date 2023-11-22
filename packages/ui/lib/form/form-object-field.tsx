import Undefined from "@fourviere/ui/lib/form/fields/undefined";
import { useField } from "formik";
import ResetField from "./reset-field";
import { PropsWithChildren } from "react";

export default function FormObjectField({
  initValue,
  fieldName,
  children,
  overrideReset,
  emtpyValueButtonMessage,
  label,
  cols = 2,
}: PropsWithChildren<{
  fieldName: string;
  initValue?: unknown;
  overrideReset?: () => void;
  emtpyValueButtonMessage?: string;
  label?: string;
  cols?: 1 | 2;
}>) {
  const [field, _, helpers] = useField(fieldName);

  function reset() {
    helpers.setValue(undefined);
  }

  const colsStyle = { 1: "grid-cols-1", 2: "grid-cols-2" }[cols];

  return (
    <div className="relative w-full">
      {field.value || !emtpyValueButtonMessage ? (
        <div className="flex items-center">
          <div className={`grid ${colsStyle} gap-2 items-center w-full mr-1`}>
            {children}
          </div>
          <div className="w-5 mt-5">
            <ResetField onClick={overrideReset ?? reset} />
          </div>
        </div>
      ) : initValue ? (
        <div>
          {label && (
            <div className="text-xs text-slate-600 capitalize font-semibold grow mb-px ml-2">
              {label}
            </div>
          )}
          <Undefined onClick={() => helpers.setValue(initValue)}>
            {emtpyValueButtonMessage}
          </Undefined>
        </div>
      ) : null}
    </div>
  );
}
