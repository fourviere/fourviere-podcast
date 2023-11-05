import classNames from "classnames";
import React, { PropsWithChildren } from "react";
import { useIntersectionObserver } from "@uidotdev/usehooks";
import { H1 } from "../typography";

interface FormSectionProps {
  title: string;
  description: string;
}
export default function FormSection({
  title,
  description,
  children,
}: PropsWithChildren<FormSectionProps>) {
  const [ref, entry] = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.7,
    root: null,
    rootMargin: "0px",
  });
  return (
    <section
      className={classNames("md:flex transition-all duration-1000", {
        "opacity-100": entry?.isIntersecting,
        "opacity-40": !entry?.isIntersecting,
      })}
      id="general"
      ref={ref}
    >
      <div className="p-5 space-y-3 lg:w-1/3 md:w-[200px] md:shrink-0 xl:w-1/4">
        <H1>{title}</H1>
        {description && <p className="text-xs text-slate-400">{description}</p>}
      </div>
      {children}
    </section>
  );
}
