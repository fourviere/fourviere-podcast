import React from "react";
import { FieldHookConfig, useField } from "formik";
import Loader from "../../loader";

interface Props {
  isUploading?: boolean;
  value?: string;
  name: string;
  id: string;
  helpMessage?: string;
  onImageClick?: (oldValue?: string) => string | void;
}

export default React.forwardRef<HTMLInputElement, Props>(
  (
    {
      isUploading,
      helpMessage,
      onImageClick: _onImageClick,
      ...props
    }: Props & FieldHookConfig<string>,
    ref,
  ) => {
    const [field, meta, helpers] = useField<string>(props);

    function onImageClick() {
      const url = _onImageClick?.(field.value);
      if (url) {
        void helpers.setValue(url);
      }
    }

    return (
      <div className="flex w-full items-center space-x-2">
        {isUploading ? (
          <Loader className="h-24 w-24 self-center p-6 text-slate-700" />
        ) : (
          <img
            onClick={onImageClick}
            className="h-24 w-24 cursor-pointer rounded border border-slate-300 object-cover shadow"
            src={field.value ?? "https://via.placeholder.com/150"}
          />
        )}

        <div className="grow space-y-2">
          <div>
            <input
              ref={ref}
              {...field}
              className="focus:shadow-outline w-full appearance-none rounded-lg border px-3 py-2 text-sm leading-tight shadow focus:outline-none"
            />
            {meta.error && typeof meta.error === "string" && (
              <div className="w-50%  mx-3 rounded-b bg-rose-50 px-2 py-1 text-xs text-rose-600">
                {meta.error}
              </div>
            )}
          </div>

          <div className="text-xs text-slate-400">{helpMessage}</div>
        </div>
      </div>
    );
  },
);
