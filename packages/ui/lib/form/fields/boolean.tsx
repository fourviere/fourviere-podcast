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
    value: unknown,
    shouldValidate?: boolean | undefined,
  ) => Promise<unknown>;
  mapBoolean: (value: boolean) => unknown;
  unmapBoolean: (value: unknown) => boolean;
}

const mapIdentity = (b: boolean) => b;
const unmapIdentity = (b: unknown) => !!b;

const Boolean = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      placeholder,
      value,
      setFieldValue,
      label,
      error,
      mapBoolean = mapIdentity,
      unmapBoolean = unmapIdentity,
    }: InputProps,
    ref,
  ) => {
    return (
      <Container wFull flex="col">
        <label className="flex cursor-pointer items-center">
          <input
            ref={ref}
            className="peer sr-only"
            id={name}
            name={name}
            type="checkbox"
            placeholder={placeholder}
            checked={unmapBoolean(value)}
            onChange={(e) => {
              console.log("onChange", e.currentTarget.checked, name);
              void setFieldValue?.(
                name as string,
                mapBoolean(e.currentTarget.checked),
              );
            }}
          />
          <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:start-[2px] after:top-0.5 after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-slate-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:ring-4 peer-focus:ring-slate-300 rtl:peer-checked:after:-translate-x-full dark:border-slate-600 dark:bg-slate-700 dark:peer-focus:ring-slate-800"></div>
          <div className="pl-3 text-xs">{label}</div>
        </label>

        {error && typeof error === "string" && (
          <div className="w-50% mx-3 rounded-b bg-rose-50 px-2 py-1 text-xs text-rose-600">
            {error}
          </div>
        )}
      </Container>
    );
  },
);

export default Boolean;
