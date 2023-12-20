import React, { PropsWithChildren } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";

interface Props {
  logo: React.ReactNode;
  main: React.ReactNode;
  footer: React.ReactNode;
}

export const SideIconMenu: React.FC<Props> = ({ main, logo, footer }) => {
  return (
    <div className="flex w-[80px] shrink-0 grow-0 flex-col items-center space-y-2 bg-slate-800 py-2 shadow-lg">
      <div className="grow-0">{logo}</div>
      <Scrollbars
        thumbSize={1}
        className="inner-shadow shrink grow [&>div]:flex [&>div]:flex-col [&>div]:items-center [&>div]:space-y-3"
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
      className="rouded flex h-16 w-16 items-center justify-center rounded-lg border-slate-700 text-slate-300 transition-all duration-200 ease-in-out  hover:border-4 hover:bg-slate-700 hover:text-slate-100"
    >
      {children}
    </button>
  );
};
