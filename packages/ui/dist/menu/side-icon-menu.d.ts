import React, { PropsWithChildren } from "react";
interface Props {
    logo: React.ReactNode;
    main: React.ReactNode;
    footer: React.ReactNode;
}
export declare const SideIconMenu: React.FC<Props>;
type SideMenuButtonProps = {
    onClick?: () => void;
};
export declare const SideMenuButton: ({ children, onClick, }: PropsWithChildren<SideMenuButtonProps>) => React.JSX.Element;
export {};
