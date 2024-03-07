import classNames from "classnames";

type Props = {
  progress: number;
  showValue?: boolean;
  height?: "px" | "sm" | "md";
  width?: "sm" | "md";
};

export default function Progress({
  progress,
  showValue,
  height,
  width,
}: Props) {
  return (
    <div
      className={classNames("rounded-full border border-slate-200", {
        "w-12": width === "sm",
        "w-8": width === "md",
        "w-full": !width,
      })}
    >
      <div
        className={classNames(
          "m-px rounded-full bg-slate-600 text-center text-xs font-medium leading-none text-slate-100 transition-all duration-500",
          {
            "h-px": height === "px",
            "h-1": height === "sm",
            "h-2": height === "md",
          },
        )}
        style={{ width: `${progress}%` }}
      >
        {showValue ?? `${progress}%`}
      </div>
    </div>
  );
}
