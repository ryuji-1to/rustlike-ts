import { None, Some, type Option } from "./option";

export interface Result<T, E> {
  /**
   * Returns the contained value if the result is `Ok`, otherwise throws an error.
   * @throws {ResultError} If called on `Err`.
   */
  unwrap(): T;

  /**
   * Returns the contained value if the result is `Err`, otherwise throws an error.
   * @throws {ResultError} If called on `Ok`.
   */
  unwrapErr(): E;

  /**
   * Returns the contained value if the result is `Ok`, otherwise returns the provided default value.
   */
  unwrapOr(or: T): T;

  /**
   * Returns the contained value if the result is `Ok`, otherwise computes a default value using the provided function.
   */
  unwrapOrElse(fn: (error: E) => T): T;

  /**
   * Returns the contained value if the result is `Ok`, otherwise throws an error with the provided message.
   * @throws {ResultError} If called on `Err`, with the given message.
   */
  expect(message: string): T;

  /**
   * Returns the contained error if the result is `Err`, otherwise throws an error with the provided message.
   * @throws {ResultError} If called on `Ok`, with the given message.
   */
  expectErr(message: string): E;

  /**
   * Returns `true` if the result is `Ok`, otherwise `false`.
   */
  isOk(): boolean;

  /**
   * Returns `true` if the result is `Err`, otherwise `false`.
   */
  isErr(): boolean;

  /**
   * Converts the `Result<T, E>` into an `Option<T>`, returning `Some(value)` if `Ok`, otherwise `None`.
   */
  ok(): Option<T>;

  /**
   * Converts the `Result<T, E>` into an `Option<E>`, returning `Some(error)` if `Err`, otherwise `None`.
   */
  err(): Option<E>;

  /**
   * Applies a function to the contained `Ok` value, returning a new `Result<T, E>`.
   * If the result is `Err`, it remains unchanged.
   */
  map<U>(fn: (data: T) => U): Result<U, E>;

  /**
   * Applies a function to the contained `Err` value, returning a new `Result<T, E>`.
   * If the result is `Ok`, it remains unchanged.
   */
  mapErr<F>(fn: (err: E) => F): Result<T, F>;

  /**
   * Maps an `Ok` value to `U`, or returns the provided fallback if `Err`.
   */
  mapOr<U>(fallback: U, fn: (data: T) => U): U;

  /**
   * Maps an `Ok` value to `U`, or computes a fallback from the error if `Err`.
   */
  mapOrElse<U>(fallbackFn: (error: E) => U, fn: (data: T) => U): U;

  /**
   * Returns `Err` if the result is `Err`, otherwise returns the provided `Result<U, E>`.
   */
  and<U>(result: Result<U, E>): Result<U, E>;

  /**
   * Applies a function to the `Ok` value and returns a new `Result<U, E>`.
   * If the result is `Err`, it remains unchanged.
   */
  andThen<U>(fn: (data: T) => Result<U, E>): Result<U, E>;

  /**
   * Returns the result if it is `Ok`, otherwise returns the provided alternative `Result<T, E>`.
   */
  or<F>(result: Result<T, F>): Result<T, F>;

  /**
   * Applies a function to the `Err` value and returns a new `Result<T, F>`.
   * If the result is `Ok`, it remains unchanged.
   */
  orElse<F>(fn: (err: E) => Result<T, F>): Result<T, F>;

  /**
   * Calls `fn` with the contained `Ok` value, then returns the original result.
   */
  inspect(fn: (data: T) => void): Result<T, E>;

  /**
   * Calls `fn` with the contained `Err` value, then returns the original result.
   */
  inspectErr(fn: (error: E) => void): Result<T, E>;

  /**
   * Returns `true` if this result is `Ok` and contains the provided value.
   */
  contains(value: T): boolean;

  /**
   * Returns `true` if this result is `Err` and contains the provided error.
   */
  containsErr(error: E): boolean;
}

/**
 * Custom error class used for errors within the Result type.
 */
export class ResultError extends Error {
  readonly name = "ResultError";
}

/**
 * Represents the Ok variant of the Result type.
 * Stores a value of type T when the operation is successful.
 */
class _Ok<T, _E = never> implements Result<T, _E> {
  readonly #data: T;
  constructor(data: T) {
    this.#data = data;
  }

  unwrap(): T {
    return this.#data;
  }

  unwrapErr(): _E {
    throw new ResultError(
      `Called unwrapErr() on an Ok value: ${JSON.stringify(this.#data)}`,
    );
  }

  unwrapOr(_: T): T {
    return this.#data;
  }

  unwrapOrElse(_: (error: _E) => T): T {
    return this.#data;
  }

  expect(_: string): T {
    return this.#data;
  }

  expectErr(message: string): _E {
    throw new ResultError(message);
  }

  isOk(): boolean {
    return true;
  }

  isErr(): boolean {
    return false;
  }

  ok(): Option<T> {
    return Some(this.#data);
  }

  err(): Option<_E> {
    return None;
  }

  map<U>(fn: (data: T) => U): Result<U, _E> {
    return Ok(fn(this.#data));
  }

  mapErr<F>(_fn: (err: _E) => F): Result<T, F> {
    return this as unknown as Result<T, F>;
  }

  mapOr<U>(_: U, fn: (data: T) => U): U {
    return fn(this.#data);
  }

  mapOrElse<U>(_: (error: _E) => U, fn: (data: T) => U): U {
    return fn(this.#data);
  }

  inspect(fn: (data: T) => void): Result<T, _E> {
    fn(this.#data);
    return this;
  }

  inspectErr(_: (error: _E) => void): Result<T, _E> {
    return this;
  }

  contains(value: T): boolean {
    return Object.is(this.#data, value);
  }

  containsErr(_: _E): boolean {
    return false;
  }

  and<U>(result: Result<U, _E>): Result<U, _E> {
    return result;
  }

  andThen<U>(fn: (data: T) => Result<U, _E>): Result<U, _E> {
    return fn(this.#data);
  }

  or<F>(_result: Result<T, F>): Result<T, F> {
    return this as unknown as Result<T, F>;
  }

  orElse<_F>(_: (err: _E) => Result<T, _F>): Result<T, _F> {
    return this as unknown as Result<T, _F>;
  }
}

/**
 * Represents the Err variant of the Result type.
 * Stores an error of type E when the operation fails.
 */
class _Err<E, _T = never> implements Result<_T, E> {
  readonly #error: E;
  constructor(error: E) {
    this.#error = error;
  }

  unwrap(): _T {
    throw new ResultError(
      `Called unwrap() on an Err value: ${JSON.stringify(this.#error)}`,
    );
  }

  unwrapErr(): E {
    return this.#error;
  }

  unwrapOr(or: _T): _T {
    return or;
  }

  unwrapOrElse(fn: (error: E) => _T): _T {
    return fn(this.#error);
  }

  expect(message: string): _T {
    throw new ResultError(message);
  }

  expectErr(_: string): E {
    return this.#error;
  }

  isOk(): boolean {
    return false;
  }

  isErr(): boolean {
    return true;
  }

  ok(): Option<_T> {
    return None;
  }

  err(): Option<E> {
    return Some(this.#error);
  }

  map<U>(_fn: (data: _T) => U): Result<U, E> {
    return this as unknown as Result<U, E>;
  }

  mapErr<F>(fn: (err: E) => F): Result<_T, F> {
    return Err(fn(this.#error));
  }

  mapOr<U>(fallback: U, _: (data: _T) => U): U {
    return fallback;
  }

  mapOrElse<U>(fallbackFn: (error: E) => U, _: (data: _T) => U): U {
    return fallbackFn(this.#error);
  }

  inspect(_: (data: _T) => void): Result<_T, E> {
    return this;
  }

  inspectErr(fn: (error: E) => void): Result<_T, E> {
    fn(this.#error);
    return this;
  }

  contains(_: _T): boolean {
    return false;
  }

  containsErr(error: E): boolean {
    return Object.is(this.#error, error);
  }

  and<_U>(_result: Result<_U, E>): Result<_U, E> {
    return this as unknown as Result<_U, E>;
  }

  andThen<_U>(_fn: (data: _T) => Result<_U, E>): Result<_U, E> {
    return this as unknown as Result<_U, E>;
  }

  or<F>(result: Result<_T, F>): Result<_T, F> {
    return result;
  }

  orElse<F>(fn: (err: E) => Result<_T, F>): Result<_T, F> {
    return fn(this.#error);
  }
}

export type InnerResultOk<T extends Result<unknown, unknown>> =
  T extends Result<infer R, unknown> ? R : never;

export type InnerResultErr<T extends Result<unknown, unknown>> =
  T extends Result<unknown, infer R> ? R : never;

// Factory function to create a Ok instance
export function Ok<T>(data: T): Result<T, never> {
  return new _Ok(data);
}

// Factory function to create a Err instance
export function Err<E>(error: E): Result<never, E> {
  return new _Err(error);
}

/**
 * Executes `fn` and converts thrown values to `Err`.
 */
export function fromThrowable<T, E = unknown>(
  fn: () => T,
  mapError: (error: unknown) => E = (error) => error as E,
): Result<T, E> {
  try {
    return Ok(fn());
  } catch (error) {
    return Err(mapError(error));
  }
}

/**
 * Converts a promise into a `Result`, mapping rejection reasons to `Err`.
 */
export async function fromPromise<T, E = unknown>(
  promise: Promise<T>,
  mapError: (error: unknown) => E = (error) => error as E,
): Promise<Result<T, E>> {
  try {
    return Ok(await promise);
  } catch (error) {
    return Err(mapError(error));
  }
}

/**
 * Executes an async function and converts rejected values to `Err`.
 */
export async function tryAsync<T, E = unknown>(
  fn: () => Promise<T>,
  mapError: (error: unknown) => E = (error) => error as E,
): Promise<Result<T, E>> {
  return fromPromise(fn(), mapError);
}

/**
 * Flattens a nested result.
 */
export function flattenResult<T, E>(
  result: Result<Result<T, E>, E>,
): Result<T, E> {
  return result.andThen((inner) => inner);
}
