import { open } from "@tauri-apps/api/dialog";
import { FILE_FAMILIES } from "../native/fs";

interface Props {
  onceSelected: (selected: string) => void | Promise<void>;
  format: keyof typeof FILE_FAMILIES;
}

export default function useSelectFile({ onceSelected, format }: Props) {
  async function openFile() {
    const selected = await open({
      title: "Select a file to upload",
      multiple: true,
      filters: [
        {
          name: FILE_FAMILIES[format].title,
          extensions: FILE_FAMILIES[format].extensions,
        },
      ],
    });

    if (!!selected && selected?.length > 0) {
      onceSelected(selected[0]);
    }
  }

  return { openFile };
}
