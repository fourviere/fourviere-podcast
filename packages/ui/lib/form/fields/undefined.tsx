import React from "react";
export default function Undefined({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full block text-xs text-left uppercase text-slate-400 border border-dashed border-slate-400 p-2 rounded-lg"
    >
      Click here to assign a value
    </button>
  );
}
