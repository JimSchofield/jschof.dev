// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): T => {
  let timerId: number;

  return ((...args: Parameters<T>) => {
    clearTimeout(timerId);

    timerId = setTimeout(() => func(...args), delay);
  }) as T;
};
