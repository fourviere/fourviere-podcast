import React from "react";
type InputSize = "sm" | "base" | "lg" | "xl" | "2xl";
interface InputProps {
    label?: string;
    name?: string;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    size?: InputSize;
    error?: boolean | string;
}
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;
export default Input;
