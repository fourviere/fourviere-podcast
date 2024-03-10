import { PropsWithChildren } from "react";
import Button from "./button";
import { CheckIcon } from "@heroicons/react/24/outline";
import { Title } from "./typography";

type Props = {
  title?: string;
  isDirty?: boolean;
  isSubmitting?: boolean;
  isDirtyMessage?: string;
  onSave?: () => void;
  postSlot?: React.ReactNode;
  isDisabled?: boolean;
};

const ContainerTitle = ({
  isDirty,
  isSubmitting,
  isDisabled,
  onSave,
  children,
  postSlot,
}: PropsWithChildren<Props>) => {
  function onSubmit(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    isDirty && onSave?.();
  }

  return (
    <div className="sticky top-0 z-10 flex w-full items-center border-b border-slate-100 bg-slate-50 bg-opacity-95 p-5 text-xl">
      <div className="flex-shrink flex-grow">
        <Title>{children}</Title>
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

      {!!onSave && (
        <Button
          size="md"
          isDisabled={!isDirty && !isSubmitting && !isDisabled}
          onClick={onSubmit}
          Icon={CheckIcon}
        >
          Save
        </Button>
      )}

      {postSlot}
    </div>
  );
};

export default ContainerTitle;
