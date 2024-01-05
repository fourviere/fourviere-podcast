import { invoke } from "@tauri-apps/api";
import { useState } from "react";
import feedStore from "../store/feed";
import { UploadResponse } from "./useUpload";
import { serializeToXML } from "@fourviere/core/lib/converter";

export default function useS3FeedUpload({
  feedId,
  updateField,
  updateError,
}: {
  feedId: string;
  updateField: (value: UploadResponse) => void;
  updateError: (value: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const { remote, s3 } = feedStore(
    (state) =>
      state.getProjectById(feedId)?.configuration?.remotes ?? {
        remote: "none",
        s3: undefined,
      },
  );

  if (!feedId) {
    return {
      upload: () => {
        updateError("No feed selected");
      },
      isUploading: false,
    };
  }

  const project = feedStore((state) => state.getProjectById(feedId));
  const xml = serializeToXML(project.feed);

  if (remote !== "s3" || !s3) {
    return {
      upload: () => {
        updateError("No remote selected");
      },
      isUploading: false,
    };
  }

  function upload(fileName: string) {
    setIsUploading(true);
    console.log("s3_xml_upload", fileName);
    invoke<UploadResponse>("s3_xml_upload", {
      payload: {
        content: xml,
        file_name: fileName,
        ...s3,
      },
    })
      .then((e) => {
        updateField(e);
      })
      .catch((e: string) => {
        updateError(e);
      })
      .finally(() => setIsUploading(false));
  }

  return { upload, isUploading };
}
