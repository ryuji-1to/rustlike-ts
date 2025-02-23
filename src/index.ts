type TODO = any;

export type Result<T, E> = { isOk: true; data: T } | { isOk: false; error: E };

export type Option<T> = { data: T } | undefined;

export function ok<T>(data: T): Extract<Result<T, undefined>, { isOk: true }> {
  return {
    isOk: true,
    data,
  };
}

export function err<E>(
  error: E,
): Extract<Result<undefined, E>, { isOk: false }> {
  return {
    isOk: false,
    error,
  };
}

export function match<T, E, R = any>(
  result: Result<T, E>,
  onOk: (data: T) => R,
  onErr: (error: E) => R,
): R {
  return result.isOk ? onOk(result.data) : onErr(result.error);
}

export class Ok<T> {
  #data: T;
  constructor(data: T) {
    this.#data = data;
  }
}

export class Err<E> {
  #error: E;
  constructor(error: E) {
    this.#error = error;
  }
}
