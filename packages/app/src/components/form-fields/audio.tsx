import React from "react";
import { useField } from "formik";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./audio.css";
import { ArrowUpTrayIcon } from "@heroicons/react/24/outline";
import { Container } from "@fourviere/ui/lib/box";
import Button from "@fourviere/ui/lib/button";
import { readFileInfo } from "../../native/fs";

interface Props {
  isUploading?: boolean;
  value?: {
    url: string;
    length: string;
    type: string;
  };
  name: string;
  id: string;
  helpMessage?: string;
  onButtonClick?: (oldValue: any) => any;
}

const AudioField = ({
  isUploading,
  value,
  onButtonClick: _onButtonClick,
  name,
}: Props) => {
  const [field, meta, helpers] = useField(name);

  function onButtonClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    const url = _onButtonClick?.(field.value);
    if (url) {
      helpers.setValue(url);
    }
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log("onChange", e.target.value);
    helpers.setValue({
      url: e.target.value,
      length: undefined,
      type: undefined,
    });
    readFileInfo(e.target.value)
      .then((fileInfo) => {
        helpers.setValue({
          url: e.target.value,
          length: fileInfo?.content_length,
          type: fileInfo?.content_type,
        });
      })
      .catch((e) => {
        console.log("boom", e);
        helpers.setError("File not found");
      });
  }

  return (
    <Container wFull spaceY="md">
      {isUploading ? (
        "LOADING"
      ) : (
        <>
          {JSON.stringify(meta)}
          <AudioPlayer src={value?.url} />

          <Container wFull>
            <Container wFull flex="row-center">
              <input
                value={value?.url}
                onChange={onChange}
                className="shadow appearance-none border rounded-lg w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-sm"
              />

              <Button size="sm" onClick={onButtonClick}>
                <ArrowUpTrayIcon className="text-slate-50 w-3" />
              </Button>
            </Container>
            <input type="text" name="" id="" value={value?.length} />
            <input type="text" name="" id="" value={value?.type} />
            <div className="flex space-x-2 items-start justify-center mt-px">
              {/* {fileData && (
                <>
                  <div className="rounded-b bg-slate-700 text-xs text-slate-50 shadow uppercase px-2 py-1 ">
                    {fileData.mimeType}
                  </div>
                  <div className="rounded-b bg-slate-700 text-xs text-slate-50 shadow px-2 py-1 ">
                    {fileData.size}
                  </div>
                </>
              )} */}
              {meta.error && typeof meta.error === "string" && (
                <div className="text-xs  bg-rose-50 text-rose-600 px-2 py-1 rounded-b mx-3 w-50%">
                  {meta.error}
                </div>
              )}
            </div>
          </Container>
        </>
      )}
    </Container>
  );
};
export default AudioField;
