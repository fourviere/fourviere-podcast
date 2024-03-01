import { Store } from "@tauri-apps/plugin-store";

export async function persistState<T>(store: string, state: T) {
  try {
    const storeFile = new Store(`${store}.dat`);
    await storeFile.set(store, state);
    await storeFile.save();
  } catch (e) {
    console.log("persistState error", e);
  }
}

export async function loadState<T>(store: string) {
  try {
    const storeFile = new Store(`${store}.dat`);
    return (await storeFile.get(store)) as T;
  } catch (e) {
    console.log("loadState error", e);
  }
}
