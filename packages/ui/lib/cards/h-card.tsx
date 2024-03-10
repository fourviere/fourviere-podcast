import React from "react";
import { H2, Note } from "../typography";
import VStack from "../layouts/v-stack";
import HStack from "../layouts/h-stack";
import Image from "../image";

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
    <Component {...props} className="group transition-all duration-500">
      <HStack
        spacing="3"
        alignItems="center"
        className="transition-all duration-500 group-hover:scale-[.95] group-hover:opacity-100"
      >
        <Image
          src={imageSrc}
          alt="Card Image"
          className="h-16 w-16 rounded-lg"
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
    </Component>
  );
};

export default HCard;
