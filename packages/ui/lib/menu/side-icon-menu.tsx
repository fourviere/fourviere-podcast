import React, { PropsWithChildren } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

interface Props {
  logo: React.ReactNode;
  main: React.ReactNode[];
  footer: React.ReactNode[];
}

export const SideIconMenu: React.FC<Props> = ({ main, logo, footer }) => {
  return (
    <div className="bg-slate-800 flex flex-col w-[80px] shadow-lg items-center grow-0 shrink-0 space-y-2 py-2">
      <div className="grow-0">{logo}</div>
      <Scrollbars
        thumbSize={1}
        className="grow shrink [&>div]:space-y-3 [&>div]:flex [&>div]:flex-col [&>div]:items-center inner-shadow"
      >
        {main}
      </Scrollbars>
      <div className="grow-0">{footer}</div>
    </div>
  );
};

type SideMenuButtonProps = {
  onClick?: () => void;
};

export const SideMenuButton = ({
  children,
  onClick,
}: PropsWithChildren<SideMenuButtonProps>) => {
  return (
    <button
      onClick={onClick}
      className="w-16 h-16 flex items-center justify-center rounded-lg rouded text-slate-300 hover:text-slate-100 hover:bg-slate-700 hover:border-4 border-slate-700  transition-all duration-200 ease-in-out"
    >
      {children}
    </button>
  );
};
