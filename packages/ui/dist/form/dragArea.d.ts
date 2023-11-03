import React, { PropsWithChildren } from "react";
interface Props {
    isHover: boolean;
    error: boolean;
}
declare const DragArea: ({ children, isHover, error }: PropsWithChildren<Props>) => React.JSX.Element;
export default DragArea;
