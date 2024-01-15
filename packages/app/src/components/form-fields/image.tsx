import { useCallback } from "react";
import { Container } from "@fourviere/ui/lib/box";
import Button from "@fourviere/ui/lib/button";
import { Note } from "@fourviere/ui/lib/typography";
import { FolderOpenIcon, XCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import useHasRemote from "../../hooks/useHasRemote";
import Progress from "@fourviere/ui/lib/progress";
import ImageComponent from "@fourviere/ui/lib/image";
import Input from "@fourviere/ui/lib/form/fields/input";
import { useField } from "formik";
import useUpload from "../../hooks/useUpload";

interface ImageProps {
  name: string;
  feedId: string;
}

const IdleImage = ({ name, feedId, onPickerClick }) => {
  const [field, meta, helpers] = useField<string>(name);

  const hasRemote = useHasRemote({ feedId });
  const onChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      helpers.setValue(e.target.value).catch(() => {});
    },
    [helpers],
  );

  return (
    <Container flex="row-middle" spaceX="md">
      {field.value && (
        <ImageComponent
          src={field.value}
          style={{ width: "90px", height: "90px" }}
        />
      )}

      <Container flex="col" spaceY="sm" wFull>
        <Container flex="row-middle" spaceX="sm">
          <Input value={field.value} onChange={onChange} />
          {hasRemote && (
            <Button
              theme="secondary"
              size="sm"
              Icon={FolderOpenIcon}
              onClick={onPickerClick}
            >
              Upload
            </Button>
          )}
        </Container>
        {!hasRemote && (
          <div>
            <Link to={`/feed/${feedId}/feed-config`}>
              <a>
                <Note>
                  Configure remote storage for uploading files from your
                  computer
                </Note>
              </a>
            </Link>
          </div>
        )}
      </Container>
    </Container>
  );
};

const ProgressImage = ({
  progress,
  abort,
}: {
  progress: number | false;
  abort: () => void;
}) => {
  return (
    progress && (
      <Container flex="row-middle" spaceX="sm">
        <Progress progress={progress} />
        <Button theme="secondary" size="sm" Icon={XCircleIcon} onClick={abort}>
          Abort
        </Button>
      </Container>
    )
  );
};

const Image = ({ name, feedId }: ImageProps) => {
  const imageUpload = useUpload({
    feedId,
    // updateField: (value: UploadResponse) => {
    //   void setFieldValue("rss.channel.0.image.url", value.url);
    // },
    updateError: () => {},
    // setFieldError("rss.channel.0.image.url", value),
    fileFamily: "audio",
  });

  return (
    <>
      {!imageUpload.inProgress && (
        <IdleImage
          name={name}
          feedId={feedId}
          onPickerClick={imageUpload.openFile}
        />
      )}

      {imageUpload.inProgress && (
        <ProgressImage
          progress={imageUpload.inProgress}
          abort={imageUpload.abort}
        />
      )}
    </>
  );
};

export default Image;
