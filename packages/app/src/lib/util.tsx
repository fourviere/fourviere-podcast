export function debounce(func: (args: any) => any, delay: number) {
  let idTimeout: number;
  return (...args: [args: any]) => {
    clearTimeout(idTimeout);
    idTimeout = setTimeout(() => {
      func.apply(null, args)
    }, delay);
  }
}