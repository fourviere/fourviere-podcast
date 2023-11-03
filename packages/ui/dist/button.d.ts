import React from "react";
type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    isLoading?: boolean;
};
declare const Button: React.FC<ButtonProps>;
export default Button;
