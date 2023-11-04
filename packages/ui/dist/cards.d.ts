import React from "react";
declare const Sizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
};
type Sizes = keyof typeof Sizes;
export declare function ImageLinkCard({ src, showError, onClick, theme, size, faded, active, }: {
    src: string;
    showError?: boolean;
    onClick?: () => void;
    theme: "dark" | "light";
    size?: Sizes;
    faded?: boolean;
    active?: boolean;
}): React.JSX.Element;
export declare const ImageLinkCardContainer: import("tailwind-styled-components/dist/tailwind").TailwindComponent<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, {}>;
export {};
