import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import feedStore from "../store/feed";
import { FILE_FAMILIES, UploadResponse } from "./useUpload";

export default function useS3Upload({
  feedId,
  updateField,
  updateError,
  fileFamily,
}: {
  feedId: string;
  updateField: (value: UploadResponse) => void;
  updateError: (value: string) => void;
  fileFamily: keyof typeof FILE_FAMILIES;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const { remote, s3 } = feedStore(
    (state) =>
      state.getProjectById(feedId)?.configuration?.remotes ?? {
        remote: "none",
        s3: undefined,
      }
  );

  if (remote !== "s3" || !s3) {
    return {
      openFile: () => {
        updateError("No remote selected");
      },
      isUploading: false,
    };
  }

  function upload(local_path: string, fileName: string) {
    setIsUploading(true);
    invoke<UploadResponse>("s3_upload", {
      payload: {
        local_path,
        file_name: fileName,
        ...s3,
      },
    })
      .then((e) => {
        updateField(e);
      })
      .catch((e) => {
        updateError(e);
      })
      .finally(() => setIsUploading(false));
  }

  function openFile() {
    open({
      title: "Select a file to upload",
      multiple: true,
      filters: [
        {
          name: FILE_FAMILIES[fileFamily].title,
          extensions: FILE_FAMILIES[fileFamily].extensions,
        },
      ],
    }).then((selected) => {
      if (!!selected && selected?.length > 0) {
        console.log(selected);
        upload(selected[0], uuidv4());
      }
    });
  }

  return { openFile, isUploading };
}
