import { PropsWithChildren } from "react";
import { H2 } from "../typography";

interface FormSectionProps {
  title: string;
  description: string;
}
export default function FormSection({
  title,
  description,
  children,
}: PropsWithChildren<FormSectionProps>) {
  return (
    <section
      className="md:flex transition-all duration-1000 w-full"
      id="general"
    >
      <div className="p-5 space-y-3 lg:w-1/3 md:w-[200px] md:shrink-0 xl:w-1/4">
        <H2>{title}</H2>
        {description && <p className="text-xs text-slate-400">{description}</p>}
      </div>
      <div className="space-y-4 w-full p-6">{children}</div>
    </section>
  );
}
