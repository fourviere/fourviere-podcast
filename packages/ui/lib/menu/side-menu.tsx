import classNames from "classnames";
import React from "react";

interface Props {
  header?: React.ReactNode;
  main: React.ReactNode;
  footer?: React.ReactNode;
}

const SideMenu: React.FC<Props> = ({ main, header, footer }) => {
  return (
    <div className="h-full flex flex-col w-[60px] lg:w-1/5  bg-slate-50  border-r border-slate-100 ">
      {header && <div className="grow-0">{header}</div>}
      {main && (
        <div className="grow shrink overflow-y-auto overflow-x-no space-y-2 inner-shadow px-3 py-3">
          {main}
        </div>
      )}
      {footer && <div className="grow-0">{footer}</div>}
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
        "side-menu-item justify-center lg:justify-start leading-tight flex px-2 py-2 items-center text-xs font-semibold text-slate-400 hover:text-slate-900 transition-all duration-300 ease-in-out",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="lg:mr-[6px] w-5 h-5 children:text-slate-600 shrink-0">
          {icon}
        </div>
      )}
      <span className="hidden lg:block">{children}</span>
    </Component>
  );
}

export default SideMenu;
