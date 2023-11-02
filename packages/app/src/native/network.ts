import { invoke } from "@tauri-apps/api/tauri";
export async function fetchFeed(url: string) {
  try {
    const response = await invoke<string>("fetch_feed", { url });
    return response;
  } catch (e) {
    console.error(e);
  }
}
