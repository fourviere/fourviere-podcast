import React from "react";
import { FieldHookConfig, useField } from "formik";
import useFileDetails from "../../hooks/use-file-details";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./audio.css";
import Button from "../../button";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import Loader from "../../loader";

interface Props {
  isUploading?: boolean;
  value?: string;
  name: string;
  id: string;
  helpMessage?: string;
  onButtonClick?: (oldValue: any) => any;
}

const AudioField = React.forwardRef<HTMLInputElement, Props>(
  (
    {
      id,
      isUploading,
      helpMessage,
      value,
      onButtonClick: _onButtonClick,
      ...props
    }: Props & FieldHookConfig<any>,
    ref
  ) => {
    const [field, meta, helpers] = useField(props);

    const fileData = useFileDetails(value);

    function onButtonClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
      e.preventDefault();
      const url = _onButtonClick?.(field.value);
      if (url) {
        helpers.setValue(url);
      }
    }

    return (
      <div className="space-y-2 w-full">
        {isUploading ? (
          <Loader className="text-slate-700 self-center h-24 w-24 p-6" />
        ) : (
          <>
            <div className="flex space-x-2">
              <AudioPlayer src={value} />
            </div>

            <div className="space-y-2 grow">
              <div>
                <div className="flex space-x-2">
                  <input
                    ref={ref}
                    {...field}
                    onChange={(e) => {
                      console.log("value changed");
                    }}
                    className="shadow appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-sm"
                  />
                  <Button size="sm" onClick={onButtonClick}>
                    <ArrowUpTrayIcon className="text-slate-50 w-3" />
                  </Button>
                </div>

                <div className="flex space-x-2 items-start justify-center mt-px">
                  {fileData && (
                    <>
                      <div className="rounded-b bg-slate-700 text-xs text-slate-50 shadow uppercase px-2 py-1 ">
                        {fileData.mimeType}
                      </div>
                      <div className="rounded-b bg-slate-700 text-xs text-slate-50 shadow px-2 py-1 ">
                        {fileData.size}
                      </div>
                    </>
                  )}
                  {meta.error && typeof meta.error === "string" && (
                    <div className="text-xs  bg-rose-50 text-rose-600 px-2 py-1 rounded-b mx-3 w-50%">
                      {meta.error}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    );
  }
);
export default AudioField;
