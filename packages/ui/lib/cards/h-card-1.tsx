import React from "react";
import { H2, Note } from "../typography";
import VStack from "../layouts/v-stack";
import HStack from "../layouts/h-stack";
import Image from "../image";
import { PencilIcon } from "@heroicons/react/24/outline";

type Extend = React.HTMLAttributes<HTMLDivElement> &
  React.HTMLAttributes<HTMLAnchorElement> &
  React.HTMLAttributes<HTMLButtonElement>;

interface HCardProps extends Extend {
  imageSrc: string;
  title: string;
  subtitle: string;
  as: React.ElementType;
}

const HCard: React.FC<HCardProps> = ({
  imageSrc,
  title,
  subtitle,
  as = "div",
  ...props
}) => {
  const Component = as;
  return (
    <Component
      {...props}
      className="group relative w-full rounded-lg bg-white transition-all duration-500"
    >
      <HStack
        className="origin-left transition-all duration-500 group-hover:scale-[.96] group-hover:opacity-30"
        spacing="3"
        alignItems="center"
        paddingX="3"
        paddingY="3"
      >
        <Image
          src={imageSrc}
          alt="Card Image"
          className="h-24 w-24 rounded-lg"
        />

        <VStack spacing="2">
          <H2>
            <span className="line-clamp-2 text-left">{title}</span>
          </H2>
          <Note>
            <span className="line-clamp-1 text-left">{subtitle}</span>
          </Note>
        </VStack>
      </HStack>
      <div className="absolute bottom-0 left-0 right-0 top-0 grid place-items-center opacity-0 transition-all duration-500 group-hover:opacity-100">
        <div className="rounded-full bg-slate-600 p-2 text-slate-50">
          <PencilIcon className="h-3 w-3" />
        </div>
      </div>
    </Component>
  );
};

export default HCard;
