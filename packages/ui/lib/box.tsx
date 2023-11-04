import React, { PropsWithChildren } from "react";
import tw from "tailwind-styled-components";

const containerXSpaces = {
  none: ``,
  sm: `space-x-1`,
  md: `space-x-2`,
  lg: `space-x-3`,
  xl: `space-x-4`,
  "2xl": `space-x-5`,
  "3xl": `space-x-6`,
  "4xl": `space-x-7`,
  "5xl": `space-x-8`,
};

type ContainerXSpaces = keyof typeof containerXSpaces;

const containerYSpaces = {
  none: ``,
  sm: `space-y-1`,
  md: `space-y-2`,
  lg: `space-y-3`,
  xl: `space-y-4`,
  "2xl": `space-y-5`,
  "3xl": `space-y-6`,
  "4xl": `space-y-7`,
  "5xl": `space-y-8`,
};

type ContainerYSpaces = keyof typeof containerYSpaces;

const containerPadding = {
  none: ``,
  sm: `p-1`,
  md: `p-2`,
  lg: `p-3`,
  xl: `p-4`,
  "2xl": `p-5`,
  "3xl": `p-6`,
  "4xl": `p-7`,
  "5xl": `p-8`,
};

type ContainerPadding = keyof typeof containerPadding;

const containerFlex = {
  none: ``,
  "row-top": `flex flex-row items-start`,
  "row-middle": `flex flex-row items-center`,
  "row-bottom": `flex flex-row items-end`,
  col: `flex flex-col`,
};

type ContainerFlex = keyof typeof containerFlex;

export const Container = ({
  spaceY = "none",
  spaceX = "none",
  padding = "none",
  flex = "none",
  children,
  wFull,
}: PropsWithChildren<{
  padding?: ContainerPadding;
  spaceY?: ContainerXSpaces;
  spaceX?: ContainerYSpaces;
  flex?: ContainerFlex;
  wFull?: boolean;
}>) => {
  return (
    <div
      className={`${containerXSpaces[spaceX]} ${containerYSpaces[spaceY]} ${
        containerPadding[padding]
      } ${containerFlex[flex]} ${wFull ? "w-full" : ""}`}
    >
      {children}
    </div>
  );
};

export const HalfPageBox = tw.div`w-1/2`;

export const ErrorBox = tw.div`text-rose-100 bg-rose-600 rounded p-3 text-xs uppercase z-30`;
