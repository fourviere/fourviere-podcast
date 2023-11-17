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
      <ChevronUpDownIcon className="absolute right-0 w-6 h-6 m-1.5 pointer-events-none text-slate-700" />
      <select
        className={classNames(
          "shadow appearance-none border bg-white rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-sm",
          className
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
