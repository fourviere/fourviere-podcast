import { PropsWithChildren, ReactElement } from "react";
import HStack from "../layouts/h-stack";
import { Label } from "../typography";

export default function FormRow({
  children,
  htmlFor,
  label,
  slot,
}: PropsWithChildren<{
  htmlFor: string;
  label?: string;
  slot?: ReactElement;
}>) {
  return (
    <div className="w-full">
      <HStack wFull>
        {label && (
          <label
            htmlFor={htmlFor}
            className="mb-1 ml-2 grow font-semibold capitalize"
          >
            <Label>{label ?? htmlFor}</Label>
          </label>
        )}
        {slot}
      </HStack>

      {children}
    </div>
  );
}
