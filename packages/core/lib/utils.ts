import { parse, getHours, getMinutes, getSeconds } from "date-fns";

function pad(value: string, template: string) {
  const prependLength = template.length - value.length;
  return `${template.slice(0, prependLength)}${value}`;
}

export function timeToSeconds(timeString: string) {
  timeString = pad(timeString, "00:00:00");
  const parsedTime = parse(timeString, "HH:mm:ss", new Date());
  const hours = getHours(parsedTime);
  const minutes = getMinutes(parsedTime);
  const seconds = getSeconds(parsedTime);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  return totalSeconds;
}
