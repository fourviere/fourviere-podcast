import { ChevronUpDownIcon } from "@heroicons/react/24/solid";
import classNames from "classnames";
import { ClassAttributes, InputHTMLAttributes } from "react";
import { JSX } from "react/jsx-runtime";

export default function Select<Option extends Record<string, string>>(
  p: JSX.IntrinsicAttributes &
    ClassAttributes<HTMLSelectElement> &
    InputHTMLAttributes<HTMLSelectElement> & {
      options: Array<Option>;
      keyProperty: keyof Option;
      labelProperty: keyof Option;
    }
) {
  const { className, options, keyProperty, labelProperty, ...props } = p;

  return (
    <>
      <select
        className={classNames(
          "shadow appearance-none border bg-white rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-sm",
          className
        )}
        {...props}
      >
        {options?.map((option) => (
          <option value={option[keyProperty]}>{option[labelProperty]}</option>
        ))}
      </select>
      <ChevronUpDownIcon className="absolute right-[34px] margin-y-auto w-6 h-6 pointer-events-none text-slate-700" />
    </>
  );
}
