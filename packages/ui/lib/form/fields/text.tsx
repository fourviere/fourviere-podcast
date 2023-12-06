import ReactQuill from "react-quill";
import "./text.css";
import classNames from "classnames";

type InputSize = "sm" | "base" | "lg" | "xl" | "2xl";

const style = ({ error, size }: Pick<Props, "error" | "size">) =>
  classNames(
    "break-words shadow appearance-none border bg-white rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ",
    {
      "text-sm": size === "sm",
      "text-base": size === "base",
      "text-lg": size === "lg",
      "text-xl font-light": size === "xl",
      "text-2xl font-light": size === "2xl",
      "text-rose-600 border-rose-600 placeholder:text-rose-400": !!error,
    }
  );

interface Props {
  name: string;
  value?: string;
  size?: InputSize;
  error?: boolean | string;
  setFieldValue?: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<unknown>;
}

const Text: React.FC<Props> = ({
  value,
  setFieldValue,
  name,
  size = "sm",
  error,
}) => {
  return (
    <>
      <ReactQuill
        theme="bubble"
        className={style({ size, error })}
        value={value}
        onChange={(e) => setFieldValue?.(name, e)}
      />
    </>
  );
};

export default Text;
