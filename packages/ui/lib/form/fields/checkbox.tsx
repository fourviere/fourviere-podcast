import { Container } from "@fourviere/ui/lib/box";
import React from "react";

type InputSize = "sm" | "base" | "lg" | "xl" | "2xl";

interface InputProps {
  label?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  size?: InputSize;
  error?: boolean | string;
}

const Checkbox = React.forwardRef<HTMLInputElement, InputProps>(
  ({ name, placeholder, value, onChange, label, error }: InputProps, ref) => (
    <Container wFull flex="col">
      <label>
        <input
          ref={ref}
          className="mr-2 h-4 w-4 rounded border-slate-300 bg-slate-100 text-slate-600 shadow focus:ring-2 focus:ring-slate-500 dark:ring-offset-slate-800 dark:focus:ring-slate-600"
          id={name}
          name={name}
          type="checkbox"
          placeholder={placeholder}
          checked={value}
          onChange={onChange}
        />
        <span className="text-xs ">{label}</span>
      </label>

      {error && typeof error === "string" && (
        <div className="w-50%  mx-3 rounded-b bg-rose-50 px-2 py-1 text-xs text-rose-600">
          {error}
        </div>
      )}
    </Container>
  ),
);

export default Checkbox;
