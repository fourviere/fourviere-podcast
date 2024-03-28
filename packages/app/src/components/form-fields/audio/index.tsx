import React from "react";
import { FieldProps } from "formik";
import ErrorAlert from "@fourviere/ui/lib/alerts/error";
import { InputRaw } from "@fourviere/ui/lib/form/fields/input";
import HStack from "@fourviere/ui/lib/layouts/h-stack";
import UseRemoteConf from "../../../hooks/use-remote-conf";
import { generateId } from "../../../store/uploads/utils";
import { Link } from "react-router-dom";
import { Note } from "@fourviere/ui/lib/typography";
import Button from "@fourviere/ui/lib/button";
import { FolderOpenIcon } from "@heroicons/react/24/outline";
import VStack from "@fourviere/ui/lib/layouts/v-stack";
import useSelectFile from "../../../hooks/use-select-file";
import { v4 as uuidv4 } from "uuid";
import uploadsStore from "../../../store/uploads";
import useUploadChange from "../../../hooks/use-upload-change";
import MicroCircular from "@fourviere/ui/lib/progress/micro-circular";
import { useTranslation } from "react-i18next";
import { readFileInfo } from "../../../native/fs";
import AudioPlayer from "react-h5-audio-player";

const FORMAT = "audio";

const AudioField: React.ComponentType<
  FieldProps<{
    url: string;
    type: string;
    length: number;
  }> & {
    label: string;
    touched: boolean;
    fieldProps: {
      feedId: string;
      episodeId?: string;
    };
  } & React.InputHTMLAttributes<HTMLInputElement>
> = ({ field, form, touched, type, fieldProps }) => {
  const feedId = fieldProps.feedId;
  const id = generateId({
    feedId,
    episodeId: fieldProps?.episodeId,
    field: field.name,
  });
  const { hasRemote, remote } = UseRemoteConf({ feedId });
  const { t } = useTranslation("utils", { keyPrefix: "form.labels" });

  const { uploads, startUpload, abortUpload } = uploadsStore((state) => ({
    uploads: state.uploads,
    startUpload: state.startUpload,
    abortUpload: state.abortUpload,
  }));
  const status = uploads[id];

  const { openFile } = useSelectFile({
    onceSelected: async (selected) => {
      await startUpload({
        feedId,
        localPath: selected,
        field: field.name,
        fileName: uuidv4(),
        remote,
      });
      return;
    },
    format: FORMAT,
  });

  const { hasFinishedUploadPending } = useUploadChange({
    onChange: (changedValue) => {
      if (changedValue.value && "url" in changedValue.value) {
        // Set the field value to the changed value
        form.setFieldValue(field.name, {
          url: changedValue.value.url,
          type: changedValue.value.mime_type,
          length: changedValue.value.size,
        });

        onChange(changedValue.value.url);
        // Update the metadata of the field
      }
    },
    id,
  });

  const onChange = (url: string) => {
    readFileInfo(url)
      .then((fileInfo) => {
        if (!fileInfo) {
          form.setFieldError(field.name, "Not correct file type");
          return;
        }

        form.setFieldValue(field.name, {
          url,
          type: fileInfo?.content_type,
          length: Number(fileInfo?.content_length),
        });
      })
      .catch(() => {
        form.setFieldError(field.name, "Not correct file type");
      });
  };

  function abort() {
    abortUpload(id).catch(() => {});
  }

  return (
    <>
      <div className="rounded-lg bg-slate-50 p-3">
        <VStack>
          {field.value && !status?.progress && field?.value?.url ? (
            <AudioPlayer src={field.value.url} />
          ) : null}
        </VStack>

        <div className="rounded-lg bg-white p-3">
          <HStack alignItems="top" spacing="3" wFull>
            <VStack
              alignItems="center"
              justifyContent="start"
              spacing="1"
              wFull
            >
              <InputRaw
                type={type ?? "text"}
                componentStyle="sm"
                disabled={!!status?.progress}
                value={field.value.url}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  form.setFieldValue(field.name, {
                    ...field.value,
                    url: e.target.value,
                  });
                  onChange(e.target.value);
                }}
              />
              <Note>
                {field.value.type} - {field.value.length}
              </Note>

              {!hasRemote ? (
                <Link to={`/feed/${feedId}/feed-config`}>
                  <Note>{t("configureRemote")}</Note>
                </Link>
              ) : null}
              {hasFinishedUploadPending && form.dirty && (
                <ErrorAlert
                  message={t("previusTriggeredUploadToSave")}
                ></ErrorAlert>
              )}
            </VStack>

            {status?.progress && (
              <MicroCircular
                value={status.progress}
                radius={15}
                showValue={true}
                strokeWidth={2}
              />
            )}
            {status?.progress ? (
              <Button theme="secondary" size="sm" onClick={abort}>
                Abort
              </Button>
            ) : null}
            {hasRemote && !status?.progress && (
              <Button
                theme="secondary"
                size="sm"
                Icon={FolderOpenIcon}
                onClick={() => {
                  openFile();
                }}
              >
                Upload
              </Button>
            )}
          </HStack>
        </div>
      </div>

      {form?.errors?.[field.name] && touched && (
        <ErrorAlert
          message={[form?.errors[field.name]].join(". ")}
        ></ErrorAlert>
      )}
      {status?.error && <ErrorAlert message={status.error}></ErrorAlert>}
    </>
  );
};
export default AudioField;
