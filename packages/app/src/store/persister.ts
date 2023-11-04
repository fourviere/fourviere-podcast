import {
  writeTextFile,
  BaseDirectory,
  createDir,
  readTextFile,
} from "@tauri-apps/api/fs";
import { appDataDir } from "@tauri-apps/api/path";

export async function persistState<T>(store: string, state: T) {
  try {
    await createDir(await appDataDir());
  } catch (e) {
    console.log("createDir error", e);
  }
  await writeTextFile(`${store}.json`, JSON.stringify(state), {
    dir: BaseDirectory.AppData,
  });
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
