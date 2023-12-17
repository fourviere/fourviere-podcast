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
    <div className="sticky top-0 z-10 flex items-center border-b border-slate-100 bg-slate-50 bg-opacity-95 p-5 text-xl">
      <div className="flex-shrink flex-grow">
        <h1 className="leading-none">{children}</h1>
        {isDirty && (
          <div className="mt-[3px] animate-pulse text-xs leading-tight text-slate-400">
            This page contains unsaved changes
          </div>
        )}
        {isSubmitting && (
          <div className="mt-[3px] animate-pulse text-xs leading-tight text-slate-400">
            This page is saving
          </div>
        )}
      </div>

      <Button
        className="p-3"
        isDisable={!isDirty && !isSubmitting}
        onClick={() => isDirty && onSave()}
      >
        <CheckIcon className="mr-1 h-4 w-4" />
        <span className="hidden sm:block">Save</span>
      </Button>
    </div>
  );
};

export default ContainerTitle;
