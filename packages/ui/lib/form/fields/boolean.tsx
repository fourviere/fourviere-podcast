import { Container } from "@fourviere/ui/lib/box";
import React from "react";

type InputSize = "sm" | "base" | "lg" | "xl" | "2xl";

interface InputProps {
  label?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: boolean;
  size?: InputSize;
  error?: boolean | string;
  setFieldValue?: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<unknown>;
  mapBoolean: (value: boolean) => any;
  unmapBoolean: (value: any) => boolean;
}

const identity = (b: any) => b;
const Boolean = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      placeholder,
      value,
      setFieldValue,
      label,
      error,
      mapBoolean = identity,
      unmapBoolean = identity,
    }: InputProps,
    ref
  ) => {
    return (
      <Container wFull flex="col">
        <label className="flex">
          <div className="relative inline-flex  cursor-pointer">
            <input
              ref={ref}
              className="sr-only peer"
              id={name}
              name={name}
              type="checkbox"
              placeholder={placeholder}
              checked={unmapBoolean(value)}
              onChange={(e) =>
                setFieldValue?.(
                  name as string,
                  mapBoolean(e.currentTarget.checked)
                )
              }
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-slate-300 dark:peer-focus:ring-slate-800 dark:bg-slate-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-slate-600 peer-checked:bg-slate-600"></div>

            <span className="ms-3 text-xs ">
              {label} {value}
            </span>
          </div>
        </label>

        {error && typeof error === "string" && (
          <div className="text-xs bg-rose-50 text-rose-600 px-2 py-1 rounded-b mx-3 w-50%">
            {error}
          </div>
        )}
      </Container>
    );
  }
);

export default Boolean;
