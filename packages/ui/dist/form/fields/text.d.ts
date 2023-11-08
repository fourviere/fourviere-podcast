import "./text.css";
import React from "react";
type InputSize = "sm" | "base" | "lg" | "xl" | "2xl";
interface Props {
    value?: string;
    onChange?: (value: string) => void;
    size?: InputSize;
    error?: boolean | string;
}
declare const Text: React.ForwardRefExoticComponent<Props & React.RefAttributes<HTMLInputElement>>;
export default Text;
