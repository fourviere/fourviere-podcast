import feedStore from "../store/feed";
import useFtpUpload from "./useFtpUpload";
import useS3Upload from "./useS3Upload";

export const FILE_FAMILIES = {
  image: {
    title: "Image",
    mime: ["image/png", "image/jpeg", "image/jpg"],
    extensions: ["png", "jpeg", "jpg"],
  },
  audio: {
    title: "Audio",
    mime: ["audio/mpeg", "audio/ogg"],
    extensions: ["mp3", "ogg"],
  },
};

export default function ({
  feedId,
  updateField,
  updateError,
  fileFamily,
}: {
  feedId: string;
  updateField: (value: string) => void;
  updateError: (value: string) => void;
  fileFamily: keyof typeof FILE_FAMILIES;
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
    fileFamily,
  });
  const s3HookResponse = useS3Upload({
    feedId,
    updateField,
    updateError,
    fileFamily,
  });

  if (remote === "ftp") {
    return ftpHookResponse;
  }

  if (remote === "s3") {
    return s3HookResponse;
  }

  return {
    openFile: () => {
      console.log(updateError);
      updateError("No remote selected");
    },
    isUploading: false,
  };
}
