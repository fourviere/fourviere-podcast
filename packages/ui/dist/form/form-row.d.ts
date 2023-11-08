import React, { PropsWithChildren, ReactElement } from "react";
export default function FormRow({ children, name, label, slot, }: PropsWithChildren<{
    name: string;
    label?: string;
    slot?: ReactElement;
}>): React.JSX.Element;
