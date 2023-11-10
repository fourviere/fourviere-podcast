import React, { PropsWithChildren } from "react";
export default function Undefined({
  onClick,
  children,
}: PropsWithChildren<{ onClick: () => void }>) {
  return (
    <button
      onClick={onClick}
      className="w-full block text-xs text-left uppercase text-slate-600 border border-dashed border-slate-500 p-2 rounded-lg"
    >
      {children}
    </button>
  );
}
