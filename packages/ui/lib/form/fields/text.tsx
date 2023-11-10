import ReactQuill from "react-quill";
import "./text.css";
import classNames from "classnames";

type InputSize = "sm" | "base" | "lg" | "xl" | "2xl";

const style = ({ error, size }: Pick<Props, "error" | "size">) =>
  classNames(
    "shadow appearance-none border bg-white rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline ",
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
  value?: string;
  onChange?: (value: string) => void;
  size?: InputSize;
  error?: boolean | string;
}

const Text = ({ value, onChange, size = "sm", error }: Props) => {
  return (
    <>
      <ReactQuill
        onChange={onChange}
        theme="bubble"
        className={style({ size, error })}
        value={value}
      />
    </>
  );
};

export default Text;
