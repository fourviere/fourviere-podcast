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
interface Props<E extends React.ElementType> {
    as?: E;
    padding?: ContainerPadding;
    spaceY?: ContainerXSpaces;
    spaceX?: ContainerYSpaces;
    flex?: ContainerFlex;
    wFull?: boolean;
    scroll?: boolean;
}
export declare function Container<E extends React.ElementType = "div">({ spaceY, spaceX, padding, flex, children, wFull, scroll, as, ...props }: PropsWithChildren<Props<E>> & React.ComponentPropsWithoutRef<E>): React.JSX.Element;
export declare const HalfPageBox: import("tailwind-styled-components/dist/tailwind").TailwindComponent<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {}>;
export declare const ErrorBox: import("tailwind-styled-components/dist/tailwind").TailwindComponent<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {}>;
export {};
