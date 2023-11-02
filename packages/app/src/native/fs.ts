import { invoke } from "@tauri-apps/api/tauri";
export async function readFile(path: string) {
  try {
    const response = await invoke<string>("read_file", { path });
    return response;
  } catch (e) {
    console.error(e);
  }
}
