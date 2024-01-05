import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";
import feedStore from "../store/feed";
import { FILE_FAMILIES, UploadResponse } from "./useUpload";
import { listen } from "@tauri-apps/api/event";

type Payload =
  | {
      Ok:
        | {
            Progress: number;
          }
        | {
            FileResult: {
              url: string;
              mime_type: string;
              size: string;
            };
          };
    }
  | {
      Err: string;
    };

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
  const [inProgress, setInProgress] = useState<false | number>(false);
  const { remote, s3 } = feedStore(
    (state) =>
      state.getProjectById(feedId)?.configuration?.remotes ?? {
        remote: "none",
        s3: undefined,
      },
  );

  if (remote !== "s3" || !s3) {
    return {
      openFile: () => {
        updateError("No remote selected");
      },
      isUploading: false,
    };
  }

  async function upload(local_path: string, fileName: string) {
    const id = await invoke<string>("s3_upload_window_progress", {
      payload: {
        local_path,
        file_name: fileName,
        ...s3,
      },
    });

    await listen(id, function ({ payload }: { payload: Payload }) {
      if ("Ok" in payload && "Progress" in payload.Ok) {
        setInProgress(payload.Ok.Progress);
        console.log(payload.Ok.Progress);
      }

      if ("Ok" in payload && "FileResult" in payload.Ok) {
        //setInProgress(false);
        console.log(payload.Ok.FileResult);
      }

      if ("Err" in payload) {
        setInProgress(false);
        console.error(payload.Err);
      }
    });

    // setIsUploading(true);
    // invoke<UploadResponse>("s3_upload", {
    //   payload: {
    //     local_path,
    //     file_name: fileName,
    //     ...s3,
    //   },
    // })
    //   .then((e) => {
    //     updateField(e);
    //   })
    //   .catch((e: string) => {
    //     updateError(e);
    //   })
    //   .finally(() => setIsUploading(false));
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
    })
      .then((selected) => {
        if (!!selected && selected?.length > 0) {
          console.log(selected);

          upload(selected[0], uuidv4());
        }
      })
      .catch((e) => {
        console.error("Error opening file", e);
      });
  }

  return { openFile, inProgress };
}
