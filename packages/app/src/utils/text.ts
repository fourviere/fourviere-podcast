/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import TurndownService from "turndown";
import { marked } from "marked";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
const turndownService: TurndownService = new TurndownService();
export function normalizeText(html?: string): string {
  if (!html) return "";
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  return marked.parse(turndownService.turndown(html)) as string;
}
