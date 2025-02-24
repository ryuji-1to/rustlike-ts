export interface Result<T, E> {
  unwrap(): T;
  unwrapOr(or: T): T;
  unwrapOrElse(fn: (error: E) => T): T;
  expect(message: string): T;
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
}

class _Err<E, _T = any> implements Result<_T, E> {
  #error: E;
  constructor(error: E) {
    this.#error = error;
  }

  unwrap(): _T {
    throw new Error("panic!!!");
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
}

export function Ok<T>(data: T): Result<T, any> {
  return new _Ok(data);
}

export function Err<E>(error: E): Result<any, E> {
  return new _Err(error);
}

function run(): Result<string, number> {
  if (Math.random() > 0.5) {
    return Ok("hoge");
  }
  return Err(10);
}
