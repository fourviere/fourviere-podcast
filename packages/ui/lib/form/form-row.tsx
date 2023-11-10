import { PropsWithChildren, ReactElement } from "react";

export default function FormRow({
  children,
  name,
  label,
  slot,
}: PropsWithChildren<{ name: string; label?: string; slot?: ReactElement }>) {
  return (
    <div className="w-full">
      <div className="flex w-full">
        {label && (
          <label
            htmlFor={name}
            className="text-xs text-slate-600 capitalize font-semibold grow mb-px ml-2"
          >
            {label ?? name}
          </label>
        )}
        {slot}
      </div>

      {children}
    </div>
  );
}
