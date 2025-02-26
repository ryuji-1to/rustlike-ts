import type { Option } from "./option";
import type { Result } from "./result";

/**
 * Matches a Result type and calls the corresponding handler function
 * depending on whether the result is Ok or Err.
 *
 * @param result - The Result type value to be matched (either Ok or Err).
 * @param onOk - The function to be called when the result is Ok.
 * @param onErr - The function to be called when the result is Err.
 * @returns The result of the handler function that is called.
 */
export function matchResult<T, E, R = any>(
  result: Result<T, E>,
  onOk: (data: T) => R,
  onErr: (error: E) => R
): R {
  return result.isOk() ? onOk(result.unwrap()) : onErr(result.expectErr(""));
}

/**
 * Matches an Option type and calls the corresponding handler function
 * depending on whether the result is Some or None.
 *
 * @param result - The Option type value to be matched (either Some or None).
 * @param onOk - The function to be called when the result is Some.
 * @param onErr - The function to be called when the result is None.
 * @returns The result of the handler function that is called.
 */
export function matchOption<T, R = any>(
  result: Option<T>,
  onOk: (data: T) => R,
  onErr: () => R
): R {
  return result.isSome() ? onOk(result.unwrap()) : onErr();
}

// export function match<T, E, R>(
//   result: Result<T, E> | Option<T>,
//   onOk: (data: T) => R,
//   onErr: (error: E | undefined) => R
// ): R {
//   if ("isOk" in result) {
//     return result.isOk() ? onOk(result.unwrap()) : onErr(result.expectErr(""));
//   }
//   return result.isSome() ? onOk(result.unwrap()) : onErr(undefined);
// }
