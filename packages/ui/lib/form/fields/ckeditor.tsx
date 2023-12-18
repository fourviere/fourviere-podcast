import "./ckeditor.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useEffect, useState } from "react";

const TOOLBAR_CONFIG = [
  "heading",
  "|",
  "bold",
  "italic",
  "blockQuote",
  "link",
  "numberedList",
  "bulletedList",
  "|",
  "undo",
  "redo",
];

interface Props {
  name: string;
  value?: string;
  setFieldValue?: (
    field: string,
    value: string,
    shouldValidate?: boolean | undefined,
  ) => Promise<unknown>;
}

const CKeditor = ({ value, setFieldValue, name }: Props) => {
  const [data, setData] = useState(value);
  useEffect(() => {
    setData(value);
  }, [value]);
  return (
    <div className="-p-px w-full appearance-none overflow-hidden break-words rounded-lg border bg-white leading-tight shadow">
      <CKEditor
        config={{
          toolbar: TOOLBAR_CONFIG,
        }}
        editor={ClassicEditor}
        data={data}
        onChange={(_, editor) => {
          console.log("o", editor.getData(), data);
          if (data !== editor.getData()) {
            setData(editor.getData());
          }
          void setFieldValue?.(name, editor.getData());
        }}
      />
    </div>
  );
};

export default CKeditor;
