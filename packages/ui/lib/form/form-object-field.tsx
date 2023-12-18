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
  const [field, , helpers] = useField(fieldName);

  function reset() {
    void helpers.setValue(undefined);
  }

  const colsStyle = { 1: "grid-cols-1", 2: "grid-cols-2" }[cols];

  return (
    <div className="relative w-full">
      {field.value || !emtpyValueButtonMessage ? (
        <div className="flex items-center">
          <div className={`grid ${colsStyle} mr-1 w-full items-center gap-2`}>
            {children}
          </div>
          <div className="mt-5 w-5">
            <ResetField onClick={overrideReset ?? reset} />
          </div>
        </div>
      ) : initValue ? (
        <div>
          {label && (
            <div className="mb-px ml-2 grow text-xs font-semibold capitalize text-slate-600">
              {label}
            </div>
          )}
          <Undefined onClick={() => void helpers.setValue(initValue)}>
            {emtpyValueButtonMessage}
          </Undefined>
        </div>
      ) : null}
    </div>
  );
}
