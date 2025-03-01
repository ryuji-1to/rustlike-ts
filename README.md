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

## Utility Functions for Matching `Result` and `Option`

This module provides utility functions for handling `Result` and `Option` types in a structured manner. The functions allow executing specific logic based on the state of these types, improving code clarity and reducing the need for explicit conditional checks.

### `matchResult<T, E, R>`

#### Description

Matches a `Result<T, E>` and executes the corresponding function based on its state:

- If the `Result` is `Ok`, it calls `op.Ok` with the contained value.
- If the `Result` is `Err`, it calls `op.Err` with the contained error.

This function provides a structured way to handle success and error cases, reducing the need for manual conditionals.

#### Parameters

- `result: Result<T, E>` - The `Result` instance to match.
- `op: { Ok: (data: T) => R; Err: (error: E) => R }` - An object containing callback functions:
  - `Ok(data: T): R` - Function executed if `result` is `Ok`, receiving the contained value.
  - `Err(error: E): R` - Function executed if `result` is `Err`, receiving the contained error.

#### Returns

`R` - The return value of the executed function.

#### Example

```typescript
const result: Result<number, string> = getResult();
const message = matchResult(result, {
  Ok: (value) => `Success: ${value}`,
  Err: (error) => `Error: ${error}`,
});
console.log(message);
```

---

### `matchOption<T, R>`

#### Description

Matches an `Option<T>` and executes the corresponding function based on its state:

- If the `Option` is `Some`, it calls `op.Some` with the contained value.
- If the `Option` is `None`, it calls `op.None`.

This function allows handling optional values in a structured way, eliminating explicit `if` statements.

#### Parameters

- `result: Option<T>` - The `Option` instance to match.
- `op: { Some: (data: T) => R; None: () => R }` - An object containing callback functions:
  - `Some(data: T): R` - Function executed if `result` is `Some`, receiving the contained value.
  - `None(): R` - Function executed if `result` is `None`.

#### Returns

`R` - The return value of the executed function.

#### Example

```typescript
const option: Option<string> = getOption();
const result = matchOption(option, {
  Some: (value) => `Value: ${value}`,
  None: () => "No value found",
});
console.log(result);
```
