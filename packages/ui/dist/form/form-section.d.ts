import React, { PropsWithChildren } from "react";
interface FormSectionProps {
    title: string;
    description: string;
}
export default function FormSection({ title, description, children, }: PropsWithChildren<FormSectionProps>): React.JSX.Element;
export {};
