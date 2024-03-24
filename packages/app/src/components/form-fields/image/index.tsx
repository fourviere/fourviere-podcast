import React, { Fragment } from "react";
import { FieldProps } from "formik";
import ErrorAlert from "@fourviere/ui/lib/alerts/error";
import ImageComponent from "@fourviere/ui/lib/image";
import { InputRaw } from "@fourviere/ui/lib/form/fields/input";
import HStack from "@fourviere/ui/lib/layouts/h-stack";
import EditButton from "@fourviere/ui/lib/edit-button";
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

const FORMAT = "image";

const Input: React.ComponentType<
  FieldProps<string> & {
    label: string;
    touched: boolean;
    fieldProps: {
      feedId: string;
      episodeId?: string;
    };
  } & React.InputHTMLAttributes<HTMLInputElement>
> = ({ field, form, touched, type, fieldProps, ...props }) => {
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
      console.log(changedValue);
      if (changedValue.value && "url" in changedValue.value) {
        form.setFieldValue(field.name, changedValue.value.url);
      }
    },
    id,
  });

  function abort() {
    abortUpload(id).catch(() => {});
  }

  const ImageWrapper = hasRemote ? EditButton : Fragment;

  return (
    <>
      <HStack alignItems="center" spacing="3" wFull>
        {field.value && !status?.progress ? (
          <ImageWrapper
            {...(hasRemote
              ? {
                  onClick: () => {
                    openFile();
                  },
                }
              : {})}
            {...(hasRemote
              ? {
                  style: {
                    cursor: "pointer",
                    width: "95px",
                    height: "95px",
                    flexShrink: 0,
                  },
                }
              : {})}
          >
            <ImageComponent
              src={field.value}
              style={{ width: "95px", height: "95px" }}
            />
          </ImageWrapper>
        ) : null}

        <VStack alignItems="center" spacing="1" wFull>
          <InputRaw
            type={type ?? "text"}
            componentStyle="sm"
            disabled={!!status?.progress}
            {...field}
            {...props}
          />
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
      {form?.errors?.[field.name] && touched && (
        <ErrorAlert
          message={[form?.errors[field.name]].join(". ")}
        ></ErrorAlert>
      )}
      {status?.error && <ErrorAlert message={status.error}></ErrorAlert>}
    </>
  );
};
export default Input;
