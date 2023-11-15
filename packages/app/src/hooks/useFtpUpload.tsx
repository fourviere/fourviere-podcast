import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import feedStore from "../store/feed";

const ALLOWED_EXENSIONS = ["png", "jpeg", "jpg"];

export default function useFtpUpload({
  feedId,
  updateField,
  updateError,
}: {
  feedId: string;
  updateField: (value: string) => void;
  updateError: (value: string) => void;
}) {
  const [isUploading, setIsUploading] = useState(false);
  const { remote, ftp } = feedStore(
    (state) =>
      state.getProjectById(feedId)?.configuration?.remotes ?? {
        remote: "none",
        ftp: undefined,
      }
  );

  if (remote !== "ftp" || !ftp) {
    return {
      openFile: () => {
        updateError("No remote selected");
      },
      isUploading: false,
    };
  }

  function upload(local_path: string, fileName: string) {
    setIsUploading(true);
    invoke<string>("ftp_upload", {
      payload: {
        local_path,
        file_name: fileName,
        ...ftp,
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
          name: "Image",
          extensions: ALLOWED_EXENSIONS,
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
