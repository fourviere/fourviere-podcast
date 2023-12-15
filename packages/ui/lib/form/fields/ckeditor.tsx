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
    value: any,
    shouldValidate?: boolean | undefined
  ) => Promise<unknown>;
}

const CKeditor: React.FC<Props> = ({ value, setFieldValue, name }) => {
  const [data, setData] = useState(value);
  useEffect(() => {
    setData(value);
  }, [value]);
  return (
    <div className="break-words shadow appearance-none border overflow-hidden bg-white rounded-lg w-full -p-px leading-tight">
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
          setFieldValue?.(name, editor.getData());
        }}
      />
    </div>
  );
};

export default CKeditor;
