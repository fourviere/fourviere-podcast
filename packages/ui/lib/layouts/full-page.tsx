import { PropsWithChildren } from "react";
import tw from "tailwind-styled-components";

export const FullPageLayoutBackground = tw.div` w-full h-full flex flex-col justify-center items-center background-logo`;

interface FullPageWithSideMenuProps {}
export const FullPageColumnLayout = ({
  children,
}: PropsWithChildren<FullPageWithSideMenuProps>) => {
  return (
    <div className="background-logo flex h-full w-full items-stretch">
      {children}
    </div>
  );
};
