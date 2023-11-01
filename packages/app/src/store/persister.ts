import {
  writeTextFile,
  BaseDirectory,
  createDir,
  readTextFile,
} from "@tauri-apps/api/fs";
import { FeedState } from "./feed";
import { appDataDir } from "@tauri-apps/api/path";

export async function persistState(state: FeedState) {
  try {
    await createDir(await appDataDir());
  } catch (e) {
    console.log("createDir error", e);
  }
  await writeTextFile("state.json", JSON.stringify(state), {
    dir: BaseDirectory.AppData,
  });

  console.log(BaseDirectory.Document);
}

export async function loadState() {
  try {
    const state = await readTextFile("state.json", {
      dir: BaseDirectory.AppData,
    });
    return JSON.parse(state) as FeedState;
  } catch (e) {
    console.log("readTextFile error", e);
  }
}
