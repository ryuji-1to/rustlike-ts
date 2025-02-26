import type { Option } from "./option";
import type { Result } from "./result";

/**
 * Matches a `Result<T, E>` and executes the corresponding function based on its state.
 * If the `Result` is `Ok`, it calls `op.Ok` with the contained value.
 * If the `Result` is `Err`, it calls `op.Err` with the contained error.
 *
 * @template T - The type of the success value.
 * @template E - The type of the error value.
 * @template R - The return type of the callback functions.
 * @param {Result<T, E>} result - The `Result` instance to match.
 * @param {object} op - An object containing callback functions for `Ok` and `Err` cases.
 * @param {(data: T) => R} op.Ok - Function to execute if `result` is `Ok`.
 * @param {(error: E) => R} op.Err - Function to execute if `result` is `Err`.
 * @returns {R} - The return value of the executed function.
 */
export function matchResult<T, E, R = any>(
	result: Result<T, E>,
	op: { Ok: (data: T) => R; Err: (error: E) => R },
) {
	return result.isOk() ? op.Ok(result.unwrap()) : op.Err(result.expectErr(""));
}

/**
 * Matches an `Option<T>` and executes the corresponding function based on its state.
 * If the `Option` is `Some`, it calls `op.Some` with the contained value.
 * If the `Option` is `None`, it calls `op.None`.
 *
 * @template T - The type of the value inside `Some`.
 * @template R - The return type of the callback functions.
 * @param {Option<T>} result - The `Option` instance to match.
 * @param {object} op - An object containing callback functions for `Some` and `None` cases.
 * @param {(data: T) => R} op.Some - Function to execute if `result` is `Some`.
 * @param {() => R} op.None - Function to execute if `result` is `None`.
 * @returns {R} - The return value of the executed function.
 */
export function matchOption<T, R = any>(
	result: Option<T>,
	op: {
		Some: (data: T) => R;
		None: () => R;
	},
): R {
	return result.isSome() ? op.Some(result.unwrap()) : op.None();
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
