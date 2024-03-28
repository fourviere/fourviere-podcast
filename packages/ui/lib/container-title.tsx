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
  hasErrors?: boolean;
  labels: {
    save: string;
    unsavedChanges: string;
    isSaving: string;
  };
};

const ContainerTitle = ({
  isDirty,
  isSubmitting,
  onSave,
  children,
  postSlot,
  labels,
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
            {labels.unsavedChanges}
          </div>
        )}
        {isSubmitting && (
          <div className="mt-[3px] animate-pulse text-xs leading-tight text-slate-400">
            {labels.isSaving}
          </div>
        )}
      </div>

      {!!onSave && (
        <Button
          size="md"
          isDisabled={!isDirty || isSubmitting}
          onClick={onSubmit}
          Icon={CheckIcon}
        >
          {labels.save}
        </Button>
      )}

      {postSlot}
    </div>
  );
};

export default ContainerTitle;
