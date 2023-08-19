export function filterNotNullable<T>(d: T | null | undefined): d is T {
  return d !== null && d !== undefined;
}
