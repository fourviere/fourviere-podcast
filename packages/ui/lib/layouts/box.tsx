import classNames from "classnames";
import { ElementType } from "react";

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
const MARGIN_X = {
  "0": "mx-0",
  "1": "mx-px",
  "2": "mx-1",
  "3": "mx-2",
  "4": "mx-3",
  "5": "mx-4",
  "6": "mx-5",
} as const;
const MARGIN_Y = {
  "0": "my-0",
  "1": "my-px",
  "2": "my-1",
  "3": "my-2",
  "4": "my-3",
  "5": "my-4",
  "6": "my-5",
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
const BACKGROUND_COLOR = {
  white: "bg-white",
  black: "bg-black",
  "slate-100": "bg-slate-100",
} as const;
const ROUNDED = {
  none: "rounded-none",
  sm: "rounded-sm",
  base: "rounded",
  lg: "rounded-lg",
  full: "rounded-full",
} as const;

interface HStackProps extends React.PropsWithChildren {
  justifyContent?: keyof typeof VERTICAL_JUSTIFY;
  alignItems?: keyof typeof VERTICAL_ALIGN;
  marginX?: keyof typeof MARGIN_X;
  marginY?: keyof typeof MARGIN_Y;
  paddingX?: keyof typeof PADDING_X;
  paddingY?: keyof typeof PADDING_Y;
  bgColor?: keyof typeof BACKGROUND_COLOR;
  rounded?: keyof typeof ROUNDED;
  wrap?: boolean;
  wFull?: boolean;
  responsive?: boolean;
  scroll?: boolean;
  as?: ElementType;
  style?: React.CSSProperties;
}

type Props = HStackProps & React.JSX.IntrinsicElements["div"];

const Box = ({
  paddingX,
  paddingY,
  wFull,
  children,
  as,
  marginX,
  marginY,
  rounded,
  bgColor,
  style,
}: Props) => {
  const Component = as ?? "div";
  const classes = classNames({
    [PADDING_X[paddingX ?? "0"]]: paddingX,
    [PADDING_Y[paddingY ?? "0"]]: paddingY,
    [MARGIN_X[marginX ?? "0"]]: marginX,
    [MARGIN_Y[marginY ?? "0"]]: marginY,
    [ROUNDED[rounded ?? "none"]]: rounded,
    [BACKGROUND_COLOR[bgColor ?? "white"]]: bgColor,
    "w-full": wFull,
  });

  return (
    <Component style={style} className={classes}>
      {children}
    </Component>
  );
};

export default Box;
