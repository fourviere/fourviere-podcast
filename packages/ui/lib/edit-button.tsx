import { PencilIcon } from "@heroicons/react/24/solid";
import React from "react";

interface EditableProps extends React.PropsWithChildren {
  onClick?: () => void;
}

const EditButton: React.FC<EditableProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="border-inner group relative rounded-lg border-dashed border-slate-400 p-[6px] text-left transition-all duration-500 hover:border"
    >
      <div className="-m-[6px] transition-all duration-500 group-hover:scale-[.96] group-hover:opacity-60">
        {children}
      </div>
      <div className="absolute bottom-0 left-0 right-0 top-0 grid place-items-center ">
        <div className="rounded-full bg-slate-600 p-2 text-slate-50 opacity-0 group-hover:opacity-100">
          <PencilIcon className="h-3 w-3" />
        </div>
      </div>
    </button>
  );
};

export default EditButton;
