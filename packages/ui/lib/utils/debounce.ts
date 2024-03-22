// eslint-disable-next-line @typescript-eslint/ban-types
export function debounce(func: Function, delay: number) {
  let timeoutId: NodeJS.Timeout;

  return (...args: unknown[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
