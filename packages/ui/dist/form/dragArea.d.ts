import React from "react";
import { PropsWithChildren } from "react";
interface Props {
    isHover: boolean;
    error: boolean;
}
declare const DragArea: ({ children, ...props }: PropsWithChildren<Props>) => React.JSX.Element;
export default DragArea;
