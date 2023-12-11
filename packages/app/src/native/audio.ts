import { Command } from "@tauri-apps/api/shell";

export async function getDuration(url: string): Promise<number> {
  const getDuration = Command.sidecar("binaries/ffprobe", [
    "-v",
    "quiet",
    "-print_format",
    "json",
    "-show_format",
    "-show_streams",
    url,
  ]);
  const res = await getDuration.execute();
  return Math.ceil(JSON.parse(res?.stdout)?.format.duration ?? 0);
}
