import React from "react";
interface Props {
    header?: React.ReactNode;
    main: React.ReactNode;
    footer?: React.ReactNode;
}
declare const SideMenu: React.FC<Props>;
export declare function SideMenuItem<T>({ children, component, className, ...props }: {
    children: React.ReactNode;
    component?: React.ElementType;
    className?: string;
    active?: boolean;
} & T): React.JSX.Element;
export default SideMenu;
