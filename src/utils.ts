import { None, Some, type Option } from "./option";
import { Err, type Result, Ok } from "./result";

/**
 * Matches a `Result<T, E>` and executes the corresponding function based on its state.
 * If the `Result` is `Ok`, it calls `op.Ok` with the contained value.
 * If the `Result` is `Err`, it calls `op.Err` with the contained error.
 *
 * @template T - The type of the success value.
 * @template E - The type of the error value.
 * @template R - The return type of the callback functions.
 * @param {Result<T, E>} result - The `Result` instance to match.
 * @param {(data: T) => R} op.Ok - Function to execute if `result` is `Ok`.
 * @param {(error: E) => R} op.Err - Function to execute if `result` is `Err`.
 * @returns {R} - The return value of the executed function.
 */
export function matchResult<T, E, R = any>(
  result: Result<T, E>,
  op: { Ok: (data: T) => R; Err: (error: E) => R }
) {
  return result.isOk() ? op.Ok(result.unwrap()) : op.Err(result.unwrapErr());
}

/**
 * Matches an `Option<T>` and executes the corresponding function based on its state.
 * If the `Option` is `Some`, it calls `op.Some` with the contained value.
 * If the `Option` is `None`, it calls `op.None`.
 *
 * @template T - The type of the value inside `Some`.
 * @template R - The return type of the callback functions.
 * @param {Option<T>} result - The `Option` instance to match.
 * @param {(data: T) => R} op.Some - Function to execute if `result` is `Some`.
 * @param {() => R} op.None - Function to execute if `result` is `None`.
 * @returns {R} - The return value of the executed function.
 */
export function matchOption<T, R = any>(
  result: Option<T>,
  op: {
    Some: (data: T) => R;
    None: () => R;
  }
): R {
  return result.isSome() ? op.Some(result.unwrap()) : op.None();
}

/**
 * Applies a transformation function to each `Some` value in an array of `Option<T>`.
 * If an element is `Some`, it applies `fn` to the contained value.
 * If an element is `None`, it remains `None`.
 *
 * @template T - The type of the value inside `Some`.
 * @param {Option<T>[]} data - The array of `Option<T>` to map over.
 * @param {(data: T) => T} fn - The function to apply to each `Some` value.
 * @returns {Option<T>[]} - A new array with transformed `Some` values.
 */
export function mapOption<T>(
  data: Option<T>[],
  fn: (data: T) => T
): Option<T>[] {
  return data.map((d) => {
    if (d.isSome()) {
      return Some(fn(d.unwrap()));
    }
    return None;
  });
}

/**
 * Applies a transformation function to each `Ok` value in an array of `Result<T, E>`.
 * If an element is `Ok`, it applies `fn` to the contained value.
 * If an element is `Err`, it remains unchanged.
 *
 * @template T - The type of the value inside `Ok`.
 * @template E - The type of the error inside `Err`.
 * @param {Result<T, E>[]} data - The array of `Result<T, E>` to map over.
 * @param {(data: T) => T} fn - The function to apply to each `Ok` value.
 * @returns {Result<T, E>[]} - A new array with transformed `Ok` values.
 */
export function mapResult<T, E>(
  data: Result<T, E>[],
  fn: (data: T) => T
): Result<T, E>[] {
  return data.map((d) => {
    if (d.isOk()) {
      return Ok(fn(d.unwrap()));
    }
    return Err(d.unwrapErr());
  });
}

/**
 * Applies a transformation function to each `Some` value in an array of `Option<T>`,
 * and filters out `None` results.
 *
 * @template T - The type of the value inside `Some`.
 * @param {Option<T>[]} data - The array of `Option<T>` to process.
 * @param {(data: T) => Option<T>} fn - The function to apply to each `Some` value.
 * @returns {Option<T>[]} - A new array containing only `Some` values after transformation.
 */
export function filterMapOption<T>(
  data: Option<T>[],
  fn: (data: T) => Option<T>
): Option<T>[] {
  return data
    .map((d) => (d.isSome() ? fn(d.unwrap()) : None))
    .filter((d) => d.isSome());
}

/**
 * Applies a transformation function to each `Ok` value in an array of `Result<T, E>`,
 * and filters out `Err` results.
 *
 * @template T - The type of the value inside `Ok`.
 * @template E - The type of the error inside `Err`.
 * @param {Result<T, E>[]} data - The array of `Result<T, E>` to process.
 * @param {(data: T) => Result<T, E>} fn - The function to apply to each `Ok` value.
 * @returns {Result<T, E>[]} - A new array containing only `Ok` values after transformation.
 */
export function filterMapResult<T, E>(
  data: Result<T, E>[],
  fn: (data: T) => Result<T, E>
): Result<T, E>[] {
  return data
    .map((d) => (d.isOk() ? fn(d.unwrap()) : Err(d.unwrapErr())))
    .filter((d) => d.isOk());
}
