import classNames from "classnames";
import React from "react";

interface Props {
  header?: React.ReactNode;
  main: React.ReactNode;
  footer?: React.ReactNode;
}

const SideMenu: React.FC<Props> = ({ main, header, footer }) => {
  return (
    <div className="h-full flex flex-col space-y-2 w-1/5  border-r border-slate-100 text-center">
      {header && <div className="grow-0">{header}</div>}
      {main && (
        <div className="grow shrink overflow-scroll space-y-2 inner-shadow p-6">
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
  ...props
}: {
  children: React.ReactNode;
  component?: React.ElementType;
  className?: string;
  active?: boolean;
} & T) {
  const Component = component ?? "div";
  return (
    <Component
      className={classNames(
        "side-menu-item text-sm block font-semibold text-slate-400 hover:text-slate-900 transition-all duration-300 ease-in-out",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export default SideMenu;
