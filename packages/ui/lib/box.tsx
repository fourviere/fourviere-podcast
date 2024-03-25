import classNames from "classnames";
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
  "row-center": `flex flex-row items-center justify-center`,
  "row-v-stretch": `flex flex-row items-stretch justify-center`,
  col: `flex flex-col`,
};

type ContainerFlex = keyof typeof containerFlex;

interface Props<E extends React.ElementType> {
  as?: E;
  padding?: ContainerPadding;
  spaceY?: ContainerXSpaces;
  spaceX?: ContainerYSpaces;
  flex?: ContainerFlex;
  wFull?: boolean;
  scroll?: boolean;
  sticky?: boolean;
  background?: "dark" | "light";
  card?: boolean;
}

export function Container<E extends React.ElementType>({
  spaceY = "none",
  spaceX = "none",
  padding = "none",
  flex = "none",
  children,
  wFull,
  scroll,
  as,
  sticky,
  card,
  ...props
}: PropsWithChildren<Props<E>> & React.ComponentPropsWithoutRef<E>) {
  const Component = as || "div" || "form";
  return (
    <Component
      {...props}
      className={classNames(
        "z-0",
        `${containerXSpaces[spaceX]}`,
        `${containerYSpaces[spaceY]}`,
        `${containerPadding[padding]}`,
        `${containerFlex[flex]}`,
        { "w-full": wFull },
        { "overflow-y-scroll": scroll },
        { "sticky top-0": sticky },
        { "bg-slate-50": props.background === "light" },
        { "bg-slate-900": props.background === "dark" },
        {
          "rounded-lg border border-slate-200 bg-slate-50 px-2 py-3":
            card && (props.background === "light" || !props?.background),
        },
        {
          "rounded-lg bg-slate-900 p-2 shadow-lg":
            card && props.background === "dark",
        },
      )}
    >
      {children}
    </Component>
  );
}

export const ErrorBox = tw.div`text-rose-100 bg-rose-600 rounded p-3 text-xs uppercase z-30`;
