import React, { PropsWithChildren } from "react";
import tw from "tailwind-styled-components";

export const FullPageLayoutBackground = tw.div`bg-white w-full h-full flex flex-col justify-center items-center background-logo`;

interface FullPageWithSideMenuProps {}
export const FullPageColumnLayout = ({
  children,
}: PropsWithChildren<FullPageWithSideMenuProps>) => {
  return (
    <div className="h-full w-full flex items-stretch background-logo">
      {children}
    </div>
  );
};
