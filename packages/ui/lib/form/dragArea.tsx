import { PropsWithChildren } from "react";
import tw from "tailwind-styled-components";

interface Props {
  isHover: boolean;
  error: boolean;
}

const Container = tw.div`p-6 h-full w-full flex flex-col`;
const BorderedBox = tw.div<{
  $isHover: boolean;
  $error: boolean;
}>`border-dashed 
border-2 h-full flex flex-col justify-center items-center rounded-lg transition-all duration-900 p-6
${(p) => (!p.$isHover && !p.$error ? "border-slate-400" : "")}
${(p) => (!!p.$error ? "border-rose-500" : "")}
${(p) => (p.$isHover ? "border-slate-500" : "")}
`;

const DragArea = ({ children, isHover, error }: PropsWithChildren<Props>) => {
  return (
    <Container>
      <BorderedBox $isHover={isHover} $error={error}>
        {children}
      </BorderedBox>
    </Container>
  );
};

export default DragArea;
