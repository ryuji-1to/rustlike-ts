export interface Result<T, E> {
  /**
   * Returns the contained value if the result is `Ok`, otherwise throws an error.
   * @throws {Error} If called on `Err`.
   */
  unwrap(): T;

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
   * @throws {Error} If called on `Err`, with the given message.
   */
  expect(message: string): T;

  /**
   * Returns the contained error if the result is `Err`, otherwise throws an error with the provided message.
   * @throws {Error} If called on `Ok`, with the given message.
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
  // ok(): Option<T>;

  /**
   * Converts the `Result<T, E>` into an `Option<E>`, returning `Some(error)` if `Err`, otherwise `None`.
   */
  // err(): Option<E>;

  /**
   * Applies a function to the contained `Ok` value, returning a new `Result<T, E>`.
   * If the result is `Err`, it remains unchanged.
   */
  map(fn: (data: T) => T): Result<T, E>;

  /**
   * Applies a function to the contained `Err` value, returning a new `Result<T, E>`.
   * If the result is `Ok`, it remains unchanged.
   */
  mapErr(fn: (err: E) => E): Result<T, E>;

  /**
   * Applies a function to the `Ok` value and returns a new `Result<U, E>`.
   * If the result is `Err`, it remains unchanged.
   */
  andThen<U>(fn: (data: T) => Result<U, E>): Result<U, E>;

  /**
   * Applies a function to the `Err` value and returns a new `Result<T, F>`.
   * If the result is `Ok`, it remains unchanged.
   */
  orElse<F>(fn: (err: E) => Result<T, F>): Result<T, F>;

  /**
   * Returns `Err` if the result is `Err`, otherwise returns the provided `Result<U, E>`.
   */
  // and<U>(result: Result<U, E>): Result<U, E>;

  /**
   * Returns the result if it is `Ok`, otherwise returns the provided alternative `Result<T, E>`.
   */
  // or(result: Result<T, E>): Result<T, E>;
}

class _Ok<T, _E = any> implements Result<T, _E> {
  #data: T;
  constructor(data: T) {
    this.#data = data;
  }

  unwrap(): T {
    return this.#data;
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
    throw new Error(message);
  }
  isOk(): boolean {
    return true;
  }
  isErr(): boolean {
    return false;
  }
  map(fn: (data: T) => T): Result<T, _E> {
    this.#data = fn(this.#data);
    return this;
  }
  mapErr(_fn: (err: _E) => _E): Result<T, _E> {
    return this;
  }
  andThen<U>(fn: (data: T) => Result<U, _E>): Result<U, _E> {
    return fn(this.#data);
  }
  orElse<_F>(_: (err: _E) => Result<T, _F>): Result<T, _F> {
    return this as unknown as Result<T, _F>;
  }
}

class _Err<E, _T = any> implements Result<_T, E> {
  #error: E;
  constructor(error: E) {
    this.#error = error;
  }

  unwrap(): _T {
    throw new Error(
      `Called unwrap() on an Err value: ${JSON.stringify(this.#error)}`
    );
  }
  unwrapOr(or: _T): _T {
    return or;
  }
  unwrapOrElse(fn: (error: E) => _T): _T {
    return fn(this.#error);
  }
  expect(message: string): _T {
    throw new Error(message);
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
  map(_fn: (data: _T) => _T): Result<_T, E> {
    return this;
  }
  mapErr(fn: (err: E) => E): Result<_T, E> {
    this.#error = fn(this.#error);
    return this;
  }
  andThen<_U>(_fn: (data: _T) => Result<_U, E>): Result<_U, E> {
    return this as unknown as Result<_U, E>;
  }
  orElse<F>(fn: (err: E) => Result<_T, F>): Result<_T, F> {
    return fn(this.#error);
  }
}

export function Ok<T>(data: T): Result<T, any> {
  return new _Ok(data);
}

export function Err<E>(error: E): Result<any, E> {
  return new _Err(error);
}
