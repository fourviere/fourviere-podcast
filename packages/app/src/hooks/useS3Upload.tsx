import { invoke } from "@tauri-apps/api";
import { open } from "@tauri-apps/api/dialog";
import { v4 as uuidv4 } from "uuid";
import { useEffect, useState } from "react";
import feedStore from "../store/feed";
import { FILE_FAMILIES } from "./useUpload";
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
  // updateField,
  updateError,
  fileFamily,
}: {
  feedId: string;
  // updateField: (value: UploadResponse) => void;
  updateError: (value: string) => void;
  fileFamily: keyof typeof FILE_FAMILIES;
}) {
  const [inProgress, setInProgress] = useState<false | number>(false);
  const [processId, setProcessId] = useState<string | undefined>(undefined);
  const [unlisten, setUnlisten] = useState<() => void>(() => {});

  // useEffect(() => {
  //   return () => {
  //     console.log("unlisten", unlisten);
  //     unlisten?.();
  //   };
  // }, []);

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
    console.log("uploading", local_path, fileName);
    const id = await invoke<string>("s3_upload_window_progress", {
      payload: {
        local_path,
        file_name: fileName,
        ...s3,
      },
    });
    console.log("process id", id);
    setProcessId(id);

    // set fake progress because the rust side fires event too quickly
    // before we can listen them in the react side
    setInProgress(7);

    const unlisten = await listen(
      id,
      function ({ payload }: { payload: Payload }) {
        console.log("payload raw", payload);
        if ("Ok" in payload && "Progress" in payload.Ok) {
          setInProgress(payload.Ok.Progress);
          console.log(payload.Ok.Progress);
        }

        if ("Ok" in payload && "FileResult" in payload.Ok) {
          setInProgress(false);
          console.log(payload.Ok.FileResult);
          unlisten();
        }

        if ("Err" in payload) {
          setInProgress(false);
          console.error(payload.Err);
          unlisten();
        }
      },
    );

    // console.log("set unlisten", unlisten);
    // setUnlisten(unlisten);
  }

  async function openFile() {
    const selected = await open({
      title: "Select a file to upload",
      multiple: true,
      filters: [
        {
          name: FILE_FAMILIES[fileFamily].title,
          extensions: FILE_FAMILIES[fileFamily].extensions,
        },
      ],
    });

    if (!!selected && selected?.length > 0) {
      await upload(selected[0], uuidv4());
    }
  }

  async function abort() {
    console.log("aborting", processId);
    if (typeof processId !== "undefined") {
      const res = await invoke("abort_progress_task", { uuid: processId });
      console.log(res);
    }
  }

  // console.log("un", unlisten);
  return { openFile, abort, inProgress };
}
