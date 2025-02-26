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
  map(fn: (data: T) => T): Option<T>;

  /**
   * Applies a function to the contained value if `Some`, returning the result.
   * If `None`, returns the provided fallback value.
   */
  mapOr(fallback: T, fn: (data: T) => T): T;

  /**
   * Applies `someFn` if `Some`, otherwise calls `noneFn` and returns its result.
   */
  mapOrElse(noneFn: () => T, someFn: (data: T) => T): T;

  /**
   * Returns `None` if the option is `None`, otherwise returns the provided `Option<T>`.
   */
  and(option: Option<T>): Option<T>;

  /**
   * Returns the option if it is `Some`, otherwise returns the provided alternative `Option<T>`.
   */
  or(or: Option<T>): Option<T>;

  /**
   * Applies a function to the contained value if `Some`, returning the resulting `Option<U>`.
   * If `None`, returns `None`.
   */
  andThen(fn: (data: T) => Option<T>): Option<T>;

  /**
   * Returns `Some` if the option is `Some` and the predicate function returns `true`.
   * Otherwise, returns `None`.
   */
  filter(fn: (data: T) => boolean): Option<T>;
}

// Custom error class for handling Option-related error
export class OptionError extends Error {
  readonly name = "OptionError";
}

// _Some class representing the 'Some' variant of Option
class _Some<T> implements Option<T> {
  #data: T;

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

  expect(_message: string): T {
    return this.#data;
  }

  unwrapOr(_or: T): T {
    return this.#data;
  }

  unwrapOrElse(_fn: () => T): T {
    return this.#data;
  }

  map(fn: (data: T) => T): Option<T> {
    this.#data = fn(this.#data);
    return this;
  }

  mapOr(_fallback: T, fn: (data: T) => T): T {
    return fn(this.#data);
  }

  mapOrElse(_noneFn: () => T, someFn: (data: T) => T): T {
    return someFn(this.#data);
  }

  and(option: Option<T>): Option<T> {
    return option.isSome() ? option : new _None<any>();
  }

  or(_or: Option<T>): Option<T> {
    return this;
  }

  andThen(fn: (data: T) => Option<T>): Option<T> {
    return fn(this.#data);
  }

  filter(fn: (data: T) => boolean): Option<T> {
    return fn(this.#data) ? this : new _None<any>();
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

  map(_fn: (data: T) => T): Option<T> {
    return this;
  }

  mapOr(fallback: T, _fn: (data: T) => T): T {
    return fallback;
  }

  mapOrElse(noneFn: () => T, _someFn: (data: T) => T): T {
    return noneFn();
  }

  and(_option: Option<T>): Option<T> {
    return this;
  }

  or(or: Option<T>): Option<T> {
    return or;
  }

  andThen(_fn: (data: T) => Option<T>): Option<T> {
    return this;
  }

  filter(_fn: (data: T) => boolean): Option<T> {
    return this;
  }
}

// Factory function to create a Some instance
export function Some<T>(data: T): Option<T> {
  return new _Some(data);
}

// Singleton instance representing the None variant
export const None: Option<any> = new _None<any>();
