import classNames from "classnames";
import { ElementType } from "react";

const SPACING = {
  "0": "space-x-0",
  "1": "space-x-px",
  "2": "space-x-1",
  "3": "space-x-2",
  "4": "space-x-3",
  "5": "space-x-4",
  "6": "space-x-5",
} as const;
const PADDING_X = {
  "0": "px-0",
  "1": "px-px",
  "2": "px-1",
  "3": "px-2",
  "4": "px-3",
  "5": "px-4",
  "6": "px-5",
} as const;
const PADDING_Y = {
  "0": "py-0",
  "1": "py-px",
  "2": "py-1",
  "3": "py-2",
  "4": "py-3",
  "5": "py-4",
  "6": "py-5",
} as const;

const VERTICAL_ALIGN = {
  top: "items-start",
  center: "items-center",
  bottom: "items-end",
} as const;

const VERTICAL_JUSTIFY = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
} as const;

interface HStackProps extends React.PropsWithChildren {
  justifyContent?: keyof typeof VERTICAL_JUSTIFY;
  alignItems?: keyof typeof VERTICAL_ALIGN;
  spacing?: keyof typeof SPACING;
  paddingX?: keyof typeof PADDING_X;
  paddingY?: keyof typeof PADDING_Y;
  wrap?: boolean;
  wFull?: boolean;
  responsive?: boolean;
  scroll?: boolean;
  as?: ElementType;
}

type DivProps = React.JSX.IntrinsicElements["div"];
type FormProps = React.JSX.IntrinsicElements["form"];

const HStack = ({
  alignItems,
  spacing,
  paddingX,
  paddingY,
  wrap,
  wFull,
  responsive,
  children,
  as,
  scroll,
  justifyContent,
}: HStackProps & (DivProps | FormProps)) => {
  const Component = as ?? "div";
  // Use classNames to dynamically build the class string
  const classes = classNames({
    [SPACING[spacing ?? "0"]]: SPACING,
    [VERTICAL_JUSTIFY[justifyContent ?? "start"]]: justifyContent,
    [VERTICAL_ALIGN[alignItems ?? "top"]]: alignItems,
    "flex-wrap": wrap,
    [PADDING_X[paddingX ?? "0"]]: paddingX,
    [PADDING_Y[paddingY ?? "0"]]: paddingY,
    "w-full": wFull,
    "md:flex flex-row": responsive,
    "flex flex-row": !responsive,
    "overflow-x-auto": scroll,
  });

  return <Component className={classes}>{children}</Component>;
};

export default HStack;
