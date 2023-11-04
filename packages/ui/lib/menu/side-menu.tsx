import React from "react";
interface Props {
  header?: React.ReactNode;
  main: React.ReactNode;
  footer?: React.ReactNode;
}

const SideMenu: React.FC<Props> = ({ main, header, footer }) => {
  return (
    <div className="bg-slate-800 grow-0 shrink-0">
      <div className="bg-white h-full flex flex-col space-y-2 rounded-l-xl">
        {header && <div className="grow-0">{header}</div>}
        {main && (
          <div className="grow shrink overflow-scroll space-y-2 inner-shadow p-6">
            {main}
          </div>
        )}
        {footer && <div className="grow-0">{footer}</div>}
      </div>
    </div>
  );
};

export function SideMenuItem<T>({
  children,
  component,
  ...props
}: {
  children: React.ReactNode;
  component?: React.ElementType;
} & T) {
  const Component = component ?? "div";
  return (
    <Component className="text-sm font-semibold block" {...props}>
      {children}
    </Component>
  );
}

export default SideMenu;
