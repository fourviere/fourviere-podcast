import {
  CursorArrowRaysIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import React from "react";

const AddField = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="w-5 h-5 text-slate-500 hover:text-slate-700"
    >
      <PlusCircleIcon />
    </button>
  );
};

export default AddField;
