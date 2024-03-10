import classNames from "classnames";
import { Container } from "@fourviere/ui/lib/box";
import React from "react";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

type InputSize = "sm" | "base" | "lg" | "xl" | "2xl";

const style = ({ size }: Pick<InputProps, "size">) =>
  classNames(
    " appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ",
    {
      "text-sm": size === "sm",
      "text-base": size === "base",
      "text-lg": size === "lg",
      "text-xl font-light": size === "xl",
      "text-2xl font-light": size === "2xl",
    },
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
    ref,
  ) => (
    <Container wFull flex="col">
      <input
        ref={ref}
        className={style({ size })}
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />

      {error && typeof error === "string" && (
        <div className="flex items-center space-x-1 rounded-b px-2 py-1 text-xs text-rose-600">
          <ExclamationCircleIcon className=" h-3 w-3" />
          <span>{error}</span>
        </div>
      )}
    </Container>
  ),
);

export default Input;
