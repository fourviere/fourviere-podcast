import classNames from "classnames";
import { Container } from "@fourviere/ui/lib/box";
import React from "react";

type InputSize = "sm" | "base" | "lg" | "xl" | "2xl";

const style = ({ error, size }: Pick<InputProps, "error" | "size">) =>
  classNames(
    "shadow appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ",
    {
      "text-sm": size === "sm",
      "text-base": size === "base",
      "text-lg": size === "lg",
      "text-xl font-light": size === "xl",
      "text-2xl font-light": size === "2xl",
      "text-rose-600 border-rose-600 placeholder:text-rose-400": !!error,
    }
  );

interface InputProps {
  label?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  value?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  size?: InputSize;
  error?: boolean | string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      name,
      type,
      placeholder,
      value,
      onChange,
      size = "sm",
      error,
    }: InputProps,
    ref
  ) => (
    <Container wFull flex="col">
      <input
        ref={ref}
        className={style({ size, error })}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      {error && typeof error === "string" && (
        <div className="text-xs  bg-rose-50 text-rose-600 px-2 py-1 rounded-b mx-3 w-50%">
          {error}
        </div>
      )}
    </Container>
  )
);

export default Input;
