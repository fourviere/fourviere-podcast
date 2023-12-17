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
            className="mb-px ml-2 grow text-xs font-semibold capitalize text-slate-600"
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
