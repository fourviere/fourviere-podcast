import classNames from "classnames";
import React from "react";

interface Props {
  header?: React.ReactNode;
  main: React.ReactNode;
  footer?: React.ReactNode;
}

const SideMenu: React.FC<Props> = ({ main, header, footer }) => {
  return (
    <div className="flex h-full w-[80px] flex-col border-r  border-slate-100  bg-slate-50 lg:w-1/5 ">
      {header && <div className="grow-0">{header}</div>}
      {main && (
        <div className="overflow-x-no inner-shadow shrink grow space-y-2 overflow-y-auto px-3 py-3">
          {main}
        </div>
      )}
      {footer && (
        <div className="flex grow-0 flex-col space-y-2 p-3">{footer}</div>
      )}
    </div>
  );
};

export function SideMenuItem<T>({
  children,
  component,
  className,
  icon,
  ...props
}: {
  children: React.ReactNode;
  component?: React.ElementType;
  className?: string;
  active?: boolean;
  icon?: React.ReactNode;
} & T) {
  const Component = component ?? "div";
  return (
    <Component
      className={classNames(
        "side-menu-item flex items-center justify-center px-2 py-2 text-xs font-semibold leading-tight text-slate-400 transition-all duration-300 ease-in-out hover:text-slate-900 lg:justify-start",
        className,
      )}
      {...props}
    >
      {icon && (
        <div className="children:text-slate-600 h-5 w-5 shrink-0 lg:mr-[6px]">
          {icon}
        </div>
      )}
      <span className="hidden lg:block">{children}</span>
    </Component>
  );
}

export default SideMenu;
