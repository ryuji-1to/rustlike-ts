import { Result } from "./result";

export function match<T, E, R = any>(
  result: Result<T, E>,
  onOk: (data: T) => R,
  onErr: (error: E) => R
): any {
  // return result.isOk ? onOk(result.data) : onErr(result.error);
}
