import { PropsWithChildren } from "react";
export default function Undefined({
  onClick,
  children,
}: PropsWithChildren<{ onClick: () => void }>) {
  return (
    <button
      onClick={onClick}
      className="block w-full rounded-lg border border-dashed border-slate-300 p-2 text-left text-xs uppercase text-slate-600"
    >
      {children}
    </button>
  );
}
