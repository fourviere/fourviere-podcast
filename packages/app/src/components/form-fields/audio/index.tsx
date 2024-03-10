import { useCallback } from "react";
import { Container } from "@fourviere/ui/lib/box";
import Button from "@fourviere/ui/lib/button";
import { Note } from "@fourviere/ui/lib/typography";
import { FolderOpenIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import Input from "@fourviere/ui/lib/form/fields/input";
import { useField } from "formik";
import uploadsStore from "../../../store/uploads";
import { v4 as uuidv4 } from "uuid";
import Progress from "@fourviere/ui/lib/progress/linear";
import { generateId } from "../../../store/uploads/utils";
import useUploadChange from "../../../hooks/use-upload-change";
import useSelectFile from "../../../hooks/use-select-file";
import UseRemoteConf from "../../../hooks/use-remote-conf";
import AudioPlayer from "react-h5-audio-player";
import "./audio.css";
import { readFileInfo } from "../../../native/fs";

const FORMAT = "audio" as const;

interface AudioProps {
  name: string;
  feedId: string;
}

const Audio = ({ name, feedId }: AudioProps) => {
  const id = generateId(feedId, name);
  const [field, meta, helpers] = useField<{
    url: string;
    type: string;
    length: number;
  }>(name);
  const { hasRemote, remote } = UseRemoteConf({ feedId });

  useUploadChange({
    onChange: (changedValue) => {
      if (changedValue.value && "url" in changedValue.value) {
        helpers.setValue({
          url: changedValue.value.url,
          type: changedValue.value.mime_type,
          length: changedValue.value.size,
        });
      }
    },
    id,
  });

  const { uploads, startUpload, abortUpload } = uploadsStore((state) => ({
    uploads: state.uploads,
    startUpload: state.startUpload,
    abortUpload: state.abortUpload,
  }));

  const status = uploads[id];

  // Manually set the value of the field to the changed value
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      void helpers.setValue({
        url: e.target.value,
        length: 0,
        type: "invalid",
      });

      readFileInfo(e.target.value)
        .then((fileInfo) => {
          if (!fileInfo) {
            helpers.setError("Not correct file type");
            return;
          }

          void helpers.setValue({
            url: e.target.value,
            length: Number(fileInfo?.content_length),
            type: fileInfo?.content_type,
          });
        })
        .catch(() => {
          helpers.setError("Not correct file type");
        });
    },
    [helpers],
  );

  const { openFile } = useSelectFile({
    onceSelected: async (selected) => {
      await startUpload({
        feedId,
        localPath: selected,
        field: name,
        fileName: uuidv4(),
        remote,
      });
      return;
    },
    format: FORMAT,
  });

  function abort() {
    abortUpload(id).catch(() => {});
  }

  return (
    <>
      {status?.progress ? (
        <Container flex="row-middle" spaceX="sm" wFull>
          <Progress progress={status.progress} />
          <Button
            theme="secondary"
            size="sm"
            Icon={XCircleIcon}
            onClick={abort}
          >
            Abort
          </Button>
        </Container>
      ) : null}

      {!status?.progress ? (
        <Container flex="col" spaceY="md" wFull>
          {field.value && <AudioPlayer src={field?.value?.url} />}
          <Container flex="col" spaceY="sm" wFull>
            <Container flex="row-middle" spaceX="sm" wFull>
              <Input
                value={field.value?.url}
                onChange={onChange}
                error={status?.error || meta.error}
              />
              {hasRemote && (
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
            </Container>
            {!hasRemote && (
              <div>
                <Link to={`/feed/${feedId}/feed-config`}>
                  <Note>
                    Configure remote storage for uploading files from your
                    computer
                  </Note>
                </Link>
              </div>
            )}
          </Container>
        </Container>
      ) : null}
    </>
  );
};

export default Audio;
