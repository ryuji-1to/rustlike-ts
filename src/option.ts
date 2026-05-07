import { type Result, Err, Ok } from "./result";

export interface Option<T> {
  /**
   * Returns `true` if the option is `Some`, otherwise `false`.
   */
  isSome(): boolean;

  /**
   * Returns `true` if the option is `None`, otherwise `false`.
   */
  isNone(): boolean;

  /**
   * Returns the contained value if `Some`, otherwise throws an error.
   * @throws {OptionError} If called on `None`.
   */
  unwrap(): T;

  /**
   * Returns the contained value if `Some`, otherwise throws an error with the given message.
   * @throws {OptionError} If called on `None`, with the provided message.
   */
  expect(message: string): T;

  /**
   * Returns the contained value if `Some`, otherwise returns the provided default value.
   */
  unwrapOr(or: T): T;

  /**
   * Returns the contained value if `Some`, otherwise computes a value from the given function.
   */
  unwrapOrElse(fn: () => T): T;

  /**
   * Applies a function to the contained value if `Some`, returning a new `Option<T>`.
   * If `None`, returns `None`.
   */
  map<U>(fn: (data: T) => U): Option<U>;

  /**
   * Applies a function to the contained value if `Some`, returning the result.
   * If `None`, returns the provided fallback value.
   */
  mapOr<U>(fallback: U, fn: (data: T) => U): U;

  /**
   * Applies `someFn` if `Some`, otherwise calls `noneFn` and returns its result.
   */
  mapOrElse<U>(noneFn: () => U, someFn: (data: T) => U): U;

  /**
   * Returns `None` if the option is `None`, otherwise returns the provided `Option<T>`.
   */
  and<U>(option: Option<U>): Option<U>;

  /**
   * Returns the option if it is `Some`, otherwise returns the provided alternative `Option<T>`.
   */
  or(or: Option<T>): Option<T>;

  /**
   * Returns the option if it is `Some`, otherwise calls `fn` and returns its result.
   */
  orElse(fn: () => Option<T>): Option<T>;

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None` to `Err(result)`.
   */
  okOr<E>(result: E): Result<T, E>;

  /**
   * Transforms the `Option<T>` into a `Result<T, E>`, mapping `Some(v)` to `Ok(v)` and `None` to `Err(errFn())`.
   * Uses a closure to create the error value only when needed.
   */
  okOrElse<E>(errFn: () => E): Result<T, E>;

  /**
   * Applies a function to the contained value if `Some`, returning the resulting `Option<U>`.
   * If `None`, returns `None`.
   */
  andThen<U>(fn: (data: T) => Option<U>): Option<U>;

  /**
   * Returns `Some` if the option is `Some` and the predicate function returns `true`.
   * Otherwise, returns `None`.
   */
  filter(fn: (data: T) => boolean): Option<T>;

  /**
   * Returns the contained value if `Some`, otherwise `null`.
   */
  toNullable(): T | null;

  /**
   * Returns the contained value if `Some`, otherwise `undefined`.
   */
  toUndefined(): T | undefined;

  /**
   * Calls `fn` with the contained value if `Some`, then returns the original option.
   */
  inspect(fn: (data: T) => void): Option<T>;

  /**
   * Returns `true` if this option is `Some` and contains the provided value.
   */
  contains(value: T): boolean;

  /**
   * Returns `Some` if exactly one of `this` or `option` is `Some`; otherwise returns `None`.
   */
  xor(option: Option<T>): Option<T>;
}

// Custom error class for handling Option-related error
export class OptionError extends Error {
  readonly name = "OptionError";
}

// _Some class representing the 'Some' variant of Option
class _Some<T> implements Option<T> {
  readonly #data: T;

  constructor(data: T) {
    this.#data = data;
  }

  isSome(): boolean {
    return true;
  }

  isNone(): boolean {
    return false;
  }

  unwrap(): T {
    return this.#data;
  }

  expect(_: string): T {
    return this.#data;
  }

  unwrapOr(_: T): T {
    return this.#data;
  }

  unwrapOrElse(_: () => T): T {
    return this.#data;
  }

  map<U>(fn: (data: T) => U): Option<U> {
    return Some(fn(this.#data));
  }

  mapOr<U>(_: U, fn: (data: T) => U): U {
    return fn(this.#data);
  }

  mapOrElse<U>(_: () => U, someFn: (data: T) => U): U {
    return someFn(this.#data);
  }

  and<U>(option: Option<U>): Option<U> {
    return option;
  }

  or(_or: Option<T>): Option<T> {
    return this;
  }

  orElse(_: () => Option<T>): Option<T> {
    return this;
  }

  okOr<E>(_: E): Result<T, E> {
    return Ok(this.#data);
  }

  okOrElse<E>(_: () => E): Result<T, E> {
    return Ok(this.#data);
  }

  andThen<U>(fn: (data: T) => Option<U>): Option<U> {
    return fn(this.#data);
  }

  filter(fn: (data: T) => boolean): Option<T> {
    return fn(this.#data) ? this : None;
  }

  toNullable(): T | null {
    return this.#data;
  }

  toUndefined(): T | undefined {
    return this.#data;
  }

  inspect(fn: (data: T) => void): Option<T> {
    fn(this.#data);
    return this;
  }

  contains(value: T): boolean {
    return Object.is(this.#data, value);
  }

  xor(option: Option<T>): Option<T> {
    return option.isSome() ? None : this;
  }
}

// _None class representing the 'None' variant of Option
class _None<T> implements Option<T> {
  isSome(): boolean {
    return false;
  }

  isNone(): boolean {
    return true;
  }

  unwrap(): T {
    throw new OptionError("Attempted to unwrap a None value!");
  }

  expect(message: string): T {
    throw new OptionError(message);
  }

  unwrapOr(or: T): T {
    return or;
  }

  unwrapOrElse(fn: () => T): T {
    return fn();
  }

  map<U>(_: (data: T) => U): Option<U> {
    return None;
  }

  mapOr<U>(fallback: U, _: (data: T) => U): U {
    return fallback;
  }

  mapOrElse<U>(noneFn: () => U, _: (data: T) => U): U {
    return noneFn();
  }

  and<U>(_: Option<U>): Option<U> {
    return None;
  }

  or(or: Option<T>): Option<T> {
    return or;
  }

  orElse(fn: () => Option<T>): Option<T> {
    return fn();
  }

  okOr<E>(result: E): Result<T, E> {
    return Err(result);
  }

  okOrElse<E>(errFn: () => E): Result<T, E> {
    return Err(errFn());
  }

  andThen<_U>(_: (data: T) => Option<_U>): Option<_U> {
    return this as unknown as Option<_U>;
  }

  filter(_: (data: T) => boolean): Option<T> {
    return this;
  }

  toNullable(): T | null {
    return null;
  }

  toUndefined(): T | undefined {
    return undefined;
  }

  inspect(_: (data: T) => void): Option<T> {
    return this;
  }

  contains(_: T): boolean {
    return false;
  }

  xor(option: Option<T>): Option<T> {
    return option.isSome() ? option : this;
  }
}

export type InnerOption<T extends Option<unknown>> = T extends Option<infer R>
  ? R
  : never;

// Factory function to create a Some instance
export function Some<T>(data: T): Option<T> {
  return new _Some(data);
}

// Singleton instance representing the None variant
export const None: Option<never> = new _None<never>();

/**
 * Converts `null` or `undefined` to `None`; all other values become `Some`.
 */
export function fromNullable<T>(data: T): Option<NonNullable<T>> {
  return data == null ? None : Some(data as NonNullable<T>);
}

/**
 * Converts a value to `Some` when `predicate` returns true, otherwise `None`.
 */
export function fromPredicate<T>(
  data: T,
  predicate: (data: T) => boolean,
): Option<T> {
  return predicate(data) ? Some(data) : None;
}

/**
 * Flattens a nested option.
 */
export function flattenOption<T>(option: Option<Option<T>>): Option<T> {
  return option.andThen((inner) => inner);
}
