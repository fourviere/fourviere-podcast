import {
  writeTextFile,
  BaseDirectory,
  createDir,
  exists,
  readTextFile,
} from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";

export async function persistState<T>(store: string, state: T) {
  try {
    const dirExists = await exists(await appDataDir());

    if (!dirExists) {
      await createDir(await appDataDir());
    }

    await writeTextFile(`${store}.json`, JSON.stringify(state), {
      dir: BaseDirectory.AppData,
    });
  } catch (e) {
    console.log("createDir error", e);
  }
}

export async function loadState<T>(store: string) {
  try {
    const state = await readTextFile(`${store}.json`, {
      dir: BaseDirectory.AppData,
    });
    return JSON.parse(state) as T;
  } catch (e) {
    console.log("readTextFile error", e);
  }
}
