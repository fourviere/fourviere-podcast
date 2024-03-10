import classNames from "classnames";
import { PropsWithChildren } from "react";

const COLS = {
  "1": "grid-cols-1",
  "2": "grid-cols-2",
  "3": "grid-cols-3",
  "4": "grid-cols-4",
  "5": "grid-cols-5",
  "6": "grid-cols-6",
  "7": "grid-cols-7",
  "8": "grid-cols-8",
  "9": "grid-cols-9",
  "10": "grid-cols-10",
  "11": "grid-cols-11",
  "12": "grid-cols-12",
} as const;

const MD_COLS = {
  "1": "md:grid-cols-1",
  "2": "md:grid-cols-2",
  "3": "md:grid-cols-3",
  "4": "md:grid-cols-4",
  "5": "md:grid-cols-5",
  "6": "md:grid-cols-6",
  "7": "md:grid-cols-7",
  "8": "md:grid-cols-8",
  "9": "md:grid-cols-9",
  "10": "md:grid-cols-10",
  "11": "md:grid-cols-11",
  "12": "md:grid-cols-12",
} as const;

const LG_COLS = {
  "1": "lg:grid-cols-1",
  "2": "lg:grid-cols-2",
  "3": "lg:grid-cols-3",
  "4": "lg:grid-cols-4",
  "5": "lg:grid-cols-5",
  "6": "lg:grid-cols-6",
  "7": "lg:grid-cols-7",
  "8": "lg:grid-cols-8",
  "9": "lg:grid-cols-9",
  "10": "lg:grid-cols-10",
  "11": "lg:grid-cols-11",
  "12": "lg:grid-cols-12",
} as const;

const SPACING = {
  "0": "gap-0",
  "1": "gap-px",
  "2": "gap-1",
  "3": "gap-2",
  "4": "gap-3",
  "5": "gap-4",
  "6": "gap-5",
  "7": "gap-6",
} as const;

interface GridProps extends PropsWithChildren {
  cols: keyof typeof COLS;
  mdCols?: keyof typeof MD_COLS;
  lgCols?: keyof typeof LG_COLS;
  spacing?: keyof typeof SPACING;
  wFull?: boolean;
}

const Grid = ({
  children,
  cols,
  mdCols,
  lgCols,
  wFull,
  spacing,
}: GridProps) => {
  return (
    <div
      className={classNames({
        "grid grid-flow-row": true,
        [COLS[cols]]: cols,
        [MD_COLS[mdCols ?? cols]]: mdCols,
        [LG_COLS[lgCols ?? cols]]: lgCols,
        [SPACING[spacing ?? 0]]: spacing,
        "w-full": wFull,
      })}
    >
      {children}
    </div>
  );
};

export default Grid;
