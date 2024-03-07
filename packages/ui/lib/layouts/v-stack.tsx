import classNames from "classnames";
import { ElementType } from "react";

const SPACING = {
  "0": "space-y-0",
  "1": "space-y-px",
  "2": "space-y-1",
  "3": "space-y-2",
  "4": "space-y-3",
  "5": "space-y-4",
  "6": "space-y-5",
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

interface VStackProps extends React.PropsWithChildren {
  justifyContent?: keyof typeof VERTICAL_JUSTIFY;
  alignItems?: keyof typeof VERTICAL_ALIGN;
  spacing?: keyof typeof SPACING;
  paddingX?: keyof typeof PADDING_X;
  paddingY?: keyof typeof PADDING_Y;
  wrap?: boolean;
  wFull?: boolean;
  responsive?: boolean;
  scroll: boolean;
  as?: ElementType;
}

const VStack: React.FC<VStackProps> = ({
  justifyContent,
  alignItems,
  spacing,
  paddingX,
  paddingY,
  wrap,
  wFull,
  responsive,
  children,
  as,
}) => {
  const Component = as ?? "div";
  // Use classNames to dynamically build the class string
  const classes = classNames({
    [SPACING[spacing]]: SPACING,
    [VERTICAL_JUSTIFY[justifyContent]]: justifyContent,
    [VERTICAL_ALIGN[alignItems]]: alignItems,
    "flex-wrap": wrap,
    [PADDING_X[paddingX]]: paddingX,
    [PADDING_Y[paddingY]]: paddingY,
    "w-full": wFull,
    "md:flex flex-col": responsive,
    "flex flex-col": !responsive,
    "overflow-y-auto": "scroll",
  });

  return <Component className={classes}>{children}</Component>;
};

export default VStack;
