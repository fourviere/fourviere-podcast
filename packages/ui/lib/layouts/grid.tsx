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

const COLSPAN = {
  "1": "col-span-1",
  "2": "col-span-2",
  "3": "col-span-3",
  "4": "col-span-4",
  "5": "col-span-5",
  "6": "col-span-6",
  "7": "col-span-7",
  "8": "col-span-8",
  "9": "col-span-9",
  "10": "col-span-10",
  "11": "col-span-11",
  "12": "col-span-12",
} as const;

const MD_COLSPAN = {
  "1": "md:col-span-1",
  "2": "md:col-span-2",
  "3": "md:col-span-3",
  "4": "md:col-span-4",
  "5": "md:col-span-5",
  "6": "md:col-span-6",
  "7": "md:col-span-7",
  "8": "md:col-span-8",
  "9": "md:col-span-9",
  "10": "md:col-span-10",
  "11": "md:col-span-11",
  "12": "md:col-span-12",
} as const;

const LG_COLSPAN = {
  "1": "lg:col-span-1",
  "2": "lg:col-span-2",
  "3": "lg:col-span-3",
  "4": "lg:col-span-4",
  "5": "lg:col-span-5",
  "6": "lg:col-span-6",
  "7": "lg:col-span-7",
  "8": "lg:col-span-8",
  "9": "lg:col-span-9",
  "10": "lg:col-span-10",
  "11": "lg:col-span-11",
  "12": "lg:col-span-12",
} as const;

interface GridCellProps extends PropsWithChildren {
  colSpan?: number;
  mdColSpan?: number;
  lgColSpan?: number;

  className?: string;
}

export const GridCell = ({
  children,
  colSpan,
  mdColSpan,
  lgColSpan,

  className,
}: GridCellProps) => {
  return (
    <div
      className={classNames({
        [COLSPAN[colSpan ?? 1]]: colSpan,
        [MD_COLSPAN[mdColSpan ?? colSpan ?? 1]]: mdColSpan,
        [LG_COLSPAN[lgColSpan ?? mdColSpan ?? colSpan ?? 1]]: lgColSpan,
        [className]: className,
      })}
    >
      {children}
    </div>
  );
};
