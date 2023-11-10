import feedStore from "../store/feed";
import useFtpUpload from "./useFtpUpload";
import useS3Upload from "./useS3Upload";

export default function ({
  feedId,
  updateField,
  updateError,
}: {
  feedId: string;
  updateField: (value: string) => void;
  updateError: (value: string) => void;
}) {
  const { remote } = feedStore(
    (state) =>
      state.getProjectById(feedId)?.configuration?.remotes ?? {
        remote: "none",
        ftp: undefined,
      }
  );
  const ftpHookResponse = useFtpUpload({
    feedId,
    updateField,
    updateError,
  });
  const s3HookResponse = useS3Upload({
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
    openFile: () => {
      updateError("No remote selected");
    },
    isUploading: false,
  };
}
