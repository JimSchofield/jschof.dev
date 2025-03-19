export const assert = <T>(el: T | null) => {
  if (!el) throw new Error("HTML Element missing");
  return el;
};

export function debounce(func: Function, wait: number, immediate?: boolean) {
  let timeout: number | undefined;
  return (...args: any[]) => {
    // @ts-expect-error accept any
    const context = this;
    clearTimeout(timeout);
    if (immediate && !timeout) func.apply(context, args);
    timeout = setTimeout(function () {
      timeout = undefined;
      if (!immediate) func.apply(context, args);
    }, wait);
  };
}
