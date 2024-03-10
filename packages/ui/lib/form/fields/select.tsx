import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";
import { ClassAttributes, InputHTMLAttributes, FC } from "react";
import { JSX } from "react/jsx-runtime";

const Select: FC<
  JSX.IntrinsicAttributes &
    ClassAttributes<HTMLSelectElement> &
    InputHTMLAttributes<HTMLSelectElement> & {
      options: Array<Record<string, string>>;
      keyProperty: string;
      labelProperty: string;
      lowercase?: boolean;
    }
> = (p) => {
  const {
    className,
    options,
    keyProperty,
    labelProperty,
    lowercase,
    ...props
  } = p;

  return (
    <div className="relative w-full">
      <ChevronUpDownIcon className="pointer-events-none absolute right-0 m-1.5 h-6 w-6 text-slate-400" />
      <select
        className={classNames(
          "focus:shadow-outline w-full appearance-none rounded-lg border bg-white px-3 py-2 text-sm leading-tight focus:outline-none",
          className,
        )}
        {...props}
      >
        {options?.map((option, i) => {
          const v = keyProperty ? option?.[keyProperty] : i;
          return (
            <option value={lowercase ? v.toString().toLowerCase() : v} key={i}>
              {option[labelProperty]}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default Select;
