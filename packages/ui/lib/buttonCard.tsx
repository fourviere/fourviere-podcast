import React from "react";
import { H1, P } from "./typography";
import classNames from "classnames";

interface ButtonCardProps {
  onClick?: () => void;
  icon?: React.ElementType;
  title: string;
  description?: string;
  topRight?: React.ReactNode;
  theme?: "light" | "dark" | "error";
}

const ButtonCard: React.FC<ButtonCardProps> = ({
  icon,
  onClick,
  title,
  description,
  topRight,
  theme,
}) => {
  // Implement your component logic here

  const Icon = icon;
  return (
    <button
      className={classNames(
        "relative max-w-80 rounded p-3 pl-10 text-left shadow transition-all duration-500 hover:shadow-sm",
        {
          "border border-slate-100 text-slate-700 hover:bg-white":
            theme === "light" || !theme,
          "bg-slate-800 text-slate-50 hover:bg-slate-700": theme === "dark",
          "border bg-rose-600 text-rose-200 hover:bg-rose-500":
            theme === "error",
        },
      )}
      onClick={onClick}
    >
      {Icon && (
        <Icon
          className={classNames("absolute left-1 top-1 h-16 w-16 opacity-10 ", {
            "opacity-10": theme === "light" || !theme,
            "opacity-20": theme === "dark",
            "text-white opacity-30": theme === "error",
          })}
        ></Icon>
      )}
      {topRight && <div className="absolute right-0 top-0 p-2">{topRight}</div>}

      <div className="space-y-3">
        <H1>{title}</H1>
        {description <P className="text-xs ">{description}</P>
      </div>
    </button>
  );
};

export default ButtonCard;
