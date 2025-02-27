# rustlike-ts

This library provides Rust-like `Result` and `Option` types for TypeScript, allowing for expressive and safe error handling.

## Features

- **Rust-inspired syntax**: Enjoy Rust-like constructs and style in your TypeScript code.
- **Improved safety**: Leverage concepts from Rust to write more robust, error-free code.
- **Performance-focused**: Designed with performance in mind, offering an efficient and streamlined development process.

## Installation

```bash
npm install rustlike-ts
```

## Result<T, E>

The `Result<T, E>` type represents either success (`Ok(T)`) or failure (`Err(E)`).

### Methods

- `unwrap()`: Returns the contained value if `Ok`, otherwise throws an error.
- `unwrapOr(or: T)`: Returns the contained value if `Ok`, otherwise returns the provided default value.
- `unwrapOrElse(fn: (error: E) => T)`: Computes a default value using the provided function.
- `expect(message: string)`: Returns the contained value or throws an error with a custom message.
- `expectErr(message: string)`: Returns the contained error or throws an error if `Ok`.
- `isOk()`: Returns `true` if `Ok`.
- `isErr()`: Returns `true` if `Err`.
- `ok()`: Converts `Result<T, E>` to `Option<T>` (`Some(T)` if `Ok`, otherwise `None`).
- `err()`: Converts `Result<T, E>` to `Option<E>` (`Some(E)` if `Err`, otherwise `None`).
- `map(fn: (data: T) => T)`: Applies a function to the `Ok` value.
- `mapErr(fn: (err: E) => E)`: Applies a function to the `Err` value.
- `and<U>(result: Result<U, E>)`: Returns `Err` if `Err`, otherwise returns the provided `Result<U, E>`.
- `andThen<U>(fn: (data: T) => Result<U, E>)`: Applies a function to the `Ok` value.
- `or(result: Result<T, E>)`: Returns `Ok` if `Ok`, otherwise returns the provided alternative.
- `orElse<F>(fn: (err: E) => Result<T, F>)`: Applies a function to the `Err` value.

### Usage

```ts
import { Ok, Err, type Result } from "rustlike-ts";

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return Err("Division by zero");
  return Ok(a / b);
}

const result = divide(10, 2);
console.log(result.unwrap()); // 5
```

## Option<T>

The `Option<T>` type represents a value that may or may not be present (`Some(T)` or `None`).

### Methods

- `isSome()`: Returns `true` if `Some`.
- `isNone()`: Returns `true` if `None`.
- `unwrap()`: Returns the contained value if `Some`, otherwise throws an error.
- `expect(message: string)`: Returns the contained value or throws an error with a custom message.
- `unwrapOr(or: T)`: Returns the contained value if `Some`, otherwise returns the default.
- `unwrapOrElse(fn: () => T)`: Computes a value using the provided function.
- `map(fn: (data: T) => T)`: Applies a function to the contained value.
- `mapOr(fallback: T, fn: (data: T) => T)`: Returns the mapped value or fallback.
- `mapOrElse(noneFn: () => T, someFn: (data: T) => T)`: Applies different functions for `Some` or `None`.
- `and(option: Option<T>)`: Returns `None` if `None`, otherwise returns the provided `Option<T>`.
- `or(or: Option<T>)`: Returns `Some` if `Some`, otherwise returns the alternative.
- `andThen(fn: (data: T) => Option<T>)`: Applies a function if `Some`.
- `filter(fn: (data: T) => boolean)`: Returns `Some` if the predicate is true, otherwise `None`.

### Usage

```ts
import { Some, None, type Option } from "rustlike-ts";

function findUser(id: number): Option<string> {
  const users = { 1: "Alice", 2: "Bob" };
  return users[id] ? Some(users[id]) : None;
}

const user = findUser(1);
console.log(user.unwrap()); // Alice
```

## Error Handling

### ResultError

A custom error class used for `Result` errors.

```ts
class ResultError extends Error {
  readonly name = "ResultError";
}
```

### OptionError

A custom error class used for `Option` errors.

```ts
class OptionError extends Error {
  readonly name = "OptionError";
}
```
