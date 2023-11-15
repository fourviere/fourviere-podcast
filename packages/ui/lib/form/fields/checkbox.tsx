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
          className="w-4 h-4 mr-2 shadow text-slate-600 bg-slate-100 border-slate-300 rounded focus:ring-slate-500 dark:focus:ring-slate-600 dark:ring-offset-slate-800 focus:ring-2"
          id={name}
          name={name}
          type="checkbox"
          placeholder={placeholder}
          checked={value}
          onChange={onChange}
        />
        <span className="text-xs uppercase ">{label}</span>
      </label>

      {error && typeof error === "string" && (
        <div className="text-xs  bg-rose-50 text-rose-600 px-2 py-1 rounded-b mx-3 w-50%">
          {error}
        </div>
      )}
    </Container>
  )
);

export default Checkbox;
