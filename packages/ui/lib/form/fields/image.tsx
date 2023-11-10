import React from "react";
import { FieldHookConfig, useField } from "formik";
import Loader from "../../loader";

interface Props {
  isUploading?: boolean;
  value?: string;
  name: string;
  id: string;
  helpMessage?: string;
  onImageClick?: (oldValue: any) => any;
}

export default React.forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      isUploading,
      helpMessage,
      value,
      onImageClick: _onImageClick,
      ...props
    }: Props & FieldHookConfig<any>,
    ref
  ) => {
    const [field, meta, helpers] = useField(props);

    function onImageClick() {
      const url = _onImageClick?.(field.value);
      if (url) {
        helpers.setValue(url);
      }
    }

    return (
      <div className="flex space-x-2 w-full items-center">
        {isUploading ? (
          <Loader className="text-slate-700 self-center h-24 w-24 p-6" />
        ) : (
          <img
            onClick={onImageClick}
            className="rounded h-24 w-24 object-cover border border-slate-300 cursor-pointer shadow"
            src={field.value ?? "https://via.placeholder.com/150"}
          />
        )}

        <div className="space-y-2 grow">
          <div>
            <input
              ref={ref}
              {...field}
              className="shadow appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-sm"
            />
            {meta.error && typeof meta.error === "string" && (
              <div className="text-xs  bg-rose-50 text-rose-600 px-2 py-1 rounded-b mx-3 w-50%">
                {meta.error}
              </div>
            )}
          </div>

          <div className="text-slate-400 text-xs">{helpMessage}</div>
        </div>
      </div>
    );
  }
);
