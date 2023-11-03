import React, { PropsWithChildren } from "react";
declare const containerXSpaces: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
    "5xl": string;
};
type ContainerXSpaces = keyof typeof containerXSpaces;
declare const containerYSpaces: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
    "5xl": string;
};
type ContainerYSpaces = keyof typeof containerYSpaces;
declare const containerPadding: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    "2xl": string;
    "3xl": string;
    "4xl": string;
    "5xl": string;
};
type ContainerPadding = keyof typeof containerPadding;
declare const containerFlex: {
    none: string;
    "row-top": string;
    "row-middle": string;
    "row-bottom": string;
    col: string;
};
type ContainerFlex = keyof typeof containerFlex;
export declare const Container: ({ spaceY, spaceX, padding, flex, children, wFull, }: React.PropsWithChildren<{
    padding?: ContainerPadding;
    spaceY?: ContainerXSpaces;
    spaceX?: ContainerYSpaces;
    flex?: ContainerFlex;
    wFull?: boolean;
}>) => React.JSX.Element;
export declare const HalfPageBox: import("tailwind-styled-components/dist/tailwind").TailwindComponent<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {}>;
export {};
