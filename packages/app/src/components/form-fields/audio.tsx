import React from "react";
import { useField } from "formik";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import "./audio.css";
import { ArrowUpTrayIcon } from "@fourviere/ui/lib/icons";
import { Container } from "@fourviere/ui/lib/box";
import Button from "@fourviere/ui/lib/button";
import { readFileInfo } from "../../native/fs";
import Input from "@fourviere/ui/lib/form/fields/input";
import ErrorContainer from "@fourviere/ui/lib/form/error-container";
import FormRow from "@fourviere/ui/lib/form/form-row";
import { FILE_FAMILIES } from "../../hooks/useUpload";
import useTranslations from "../../hooks/useTranslations";
import Loader from "@fourviere/ui/lib/loader";

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
  onChange?: (url: string) => void;
}

const AudioField = ({
  isUploading,
  value,
  onButtonClick: _onButtonClick,
  name,
  onChange,
}: Props) => {
  const [field, meta, helpers] = useField(name);
  const t = useTranslations();

  function onButtonClick(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.preventDefault();
    const url = _onButtonClick?.(field.value);
    if (url) {
      helpers.setValue(url);
    }
  }

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    helpers.setValue({
      url: e.target.value,
      length: undefined,
      type: undefined,
    });
    readFileInfo(e.target.value)
      .then((fileInfo) => {
        if (
          !fileInfo ||
          fileInfo.content_type ||
          FILE_FAMILIES["image"].mime.includes(fileInfo.content_type)
        ) {
          helpers.setError("Not correct file type");
        }
        onChange?.(e.target.value);
        helpers.setValue({
          url: e.target.value,
          length: fileInfo?.content_length,
          type: fileInfo?.content_type,
        });
      })
      .catch(() => {
        helpers.setError("File not found");
      });
  }

  function onChangeLength(e: React.ChangeEvent<HTMLInputElement>) {
    helpers.setValue({
      ...field.value,
      length: e.target.value,
    });
  }

  function onChangeType(e: React.ChangeEvent<HTMLInputElement>) {
    helpers.setValue({
      ...field.value,
      type: e.target.value,
    });
  }

  return (
    <Container wFull spaceY="md">
      {isUploading ? (
        <Container>
          <Loader />
        </Container>
      ) : (
        <>
          <Container>
            <AudioPlayer src={value?.url} />
            {meta.error && typeof meta.error === "string" && (
              <ErrorContainer error={meta.error} />
            )}
          </Container>

          <Container wFull spaceY="md">
            <Container>
              <FormRow
                name="sadas"
                label={t["edit_feed.items_fields.enclosure_url.url"]}
              >
                <Container wFull flex="row-v-stretch" spaceX="sm">
                  <Input value={value?.url} onChange={onInputChange} />
                  <Button
                    size="sm"
                    onClick={onButtonClick}
                    Icon={ArrowUpTrayIcon}
                  ></Button>
                </Container>
              </FormRow>
            </Container>

            <Container wFull flex="row-center" spaceX="md">
              <FormRow
                name="sadas"
                label={t["edit_feed.items_fields.enclosure_url.length"]}
              >
                <Input
                  type="text"
                  name=""
                  value={value?.length}
                  onChange={onChangeLength}
                />
              </FormRow>
              <FormRow
                name="sadas"
                label={t["edit_feed.items_fields.enclosure_url.type"]}
              >
                <Input
                  type="text"
                  name=""
                  value={value?.type}
                  onChange={onChangeType}
                />
              </FormRow>
            </Container>

            <Container className="mt-px flex items-start justify-center space-x-2"></Container>
          </Container>
        </>
      )}
    </Container>
  );
};
export default AudioField;
