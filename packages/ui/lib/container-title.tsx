import { PropsWithChildren } from "react";
import Button from "./button";
import { CheckIcon } from "@heroicons/react/24/outline";

type Props = {
  title?: string;
  isDirty?: boolean;
  isSubmitting?: boolean;
  isDirtyMessage?: string;
  onSave: () => void;
};

const ContainerTitle = ({
  isDirty,
  isSubmitting,
  onSave,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <div className="sticky top-0 bg-slate-50 bg-opacity-95 p-5 text-xl flex items-center z-10 border-b border-slate-100">
      <div className="flex-grow flex-shrink">
        <h1 className="leading-none">{children}</h1>
        {isDirty && (
          <div className="mt-[3px] text-xs text-slate-400 leading-tight animate-pulse">
            This page contains unsaved changes
          </div>
        )}
        {isSubmitting && (
          <div className="mt-[3px] text-xs text-slate-400 leading-tight animate-pulse">
            This page is saving
          </div>
        )}
      </div>

      <Button
        className="p-3"
        isDisable={!isDirty && !isSubmitting}
        onClick={() => isDirty && onSave()}
      >
        <CheckIcon className="w-4 h-4 mr-1" />
        <span className="hidden sm:block">Save</span>
      </Button>
    </div>
  );
};

export default ContainerTitle;
