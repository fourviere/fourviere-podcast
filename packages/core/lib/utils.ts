import { parse, getHours, getMinutes, getSeconds } from "date-fns";

export function timeToSeconds(timeString: string) {
  const parsedTime = parse(timeString, "HH:mm:ss", new Date());
  const hours = getHours(parsedTime);
  const minutes = getMinutes(parsedTime);
  const seconds = getSeconds(parsedTime);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return totalSeconds;
}
