export interface Result<T, E> {
  unwrap(): T;
  unwrapOr(or: T): T;
  unwrapOrElse(fn: (error: E) => T): T;
  expect(message: string): T;
  isOk(): boolean;
  isErr(): boolean;
  map(fn: (data: T) => T): Result<T, E>;
  mapErr(fn: (err: E) => E): Result<T, E>;
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
}

export function Ok<T>(data: T): Result<T, any> {
  return new _Ok(data);
}

export function Err<E>(error: E): Result<any, E> {
  return new _Err(error);
}
