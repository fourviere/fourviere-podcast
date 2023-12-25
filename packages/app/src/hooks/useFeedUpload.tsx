import feedStore from "../store/feed";
import useFtpFeedUpload from "./useFtpFeedUpload";
import useS3FeedUpload from "./useS3FeedUpload";

export type UploadResponse = {
  url: string;
  mime_type: string;
  size: number;
};

export default function ({
  feedId,
  updateField,
  updateError,
}: {
  feedId: string;
  updateField: (value: UploadResponse) => void;
  updateError: (value: string) => void;
}) {
  const { remote } = feedStore(
    (state) =>
      state.getProjectById(feedId)?.configuration?.remotes ?? {
        remote: "none",
        ftp: undefined,
      },
  );
  const ftpHookResponse = useFtpFeedUpload({
    feedId,
    updateField,
    updateError,
  });

  const s3HookResponse = useS3FeedUpload({
    feedId,
    updateField,
    updateError,
  });

  if (remote === "ftp") {
    return ftpHookResponse;
  }

  if (remote === "s3") {
    return s3HookResponse;
  }

  return {
    upload: () => {
      console.log(updateError);
      updateError("No remote selected");
    },
    isUploading: false,
  };
}
