export interface Result<T, E> {
  // Returns the value if it's Ok
  unwrap(): T;
  // Returns the value if it's Ok, or a default value if it's Err
  unwrapOr(or: T): T;
  // Returns the value if it's Ok, or generates a default value using a function if it's Err
  unwrapOrElse(fn: (error: E) => T): T;
  // Returns the value if it's Ok, throws an error with a message if it's Err
  expect(message: string): T;
  // Returns the error value if it's Err, throws an error with a message if it's Ok
  expectErr(message: string): E;
  // Returns true if it's Ok
  isOk(): boolean;
  // Returns true if it's Err
  isErr(): boolean;
  // ok();
  // err();
  // Transforms the Ok value using the given function
  map(fn: (data: T) => T): Result<T, E>;
  // Transforms the Err value using the given function
  mapErr(fn: (err: E) => E): Result<T, E>;
  // Returns a new Result from the Ok value using a function, or keeps the same Result if it's Err
  andThen<U>(fn: (data: T) => Result<U, E>): Result<U, E>;
  // Returns a new Result from the Err value using a function, or keeps the same Result if it's Ok
  orElse<F>(fn: (err: E) => Result<T, F>): Result<T, F>;
  // and();
  // or();
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
