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

  type Data = { format: { duration: number } };

  const dataParsed = JSON.parse(res.stdout) as Data;

  return Math.floor(dataParsed?.format.duration ?? 0);
}
