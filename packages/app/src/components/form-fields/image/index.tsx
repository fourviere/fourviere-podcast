import { useCallback } from "react";
import { Container } from "@fourviere/ui/lib/box";
import Button from "@fourviere/ui/lib/button";
import { Note } from "@fourviere/ui/lib/typography";
import { FolderOpenIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import ImageComponent from "@fourviere/ui/lib/image";
import Input from "@fourviere/ui/lib/form/fields/input";
import { useField } from "formik";
import uploadsStore from "../../../store/uploads";
import { v4 as uuidv4 } from "uuid";
import Progress from "@fourviere/ui/lib/progress/linear";
import { generateId } from "../../../store/uploads/utils";
import useUploadChange from "../../../hooks/use-upload-change";
import useSelectFile from "../../../hooks/use-select-file";
import UseRemoteConf from "../../../hooks/use-remote-conf";

const FORMAT = "image";

interface ImageProps {
  name: string;
  feedId: string;
}

const Image = ({ name, feedId }: ImageProps) => {
  const id = generateId(feedId, name);
  const [field, meta, helpers] = useField<string>(name);
  const { hasRemote, remote } = UseRemoteConf({ feedId });

  useUploadChange({
    onChange: (changedValue) => {
      if (changedValue.value && "url" in changedValue.value) {
        helpers.setValue(changedValue.value.url);
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

  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      helpers.setValue(e.target.value).catch(() => {});
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
        <Container flex="row-middle" spaceX="md" wFull>
          {field.value && (
            <ImageComponent
              src={field.value}
              style={{ width: "95px", height: "95px" }}
            />
          )}

          <Container flex="col" spaceY="sm" wFull>
            <Container flex="row-middle" spaceX="sm">
              <Input
                value={field.value}
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

export default Image;
