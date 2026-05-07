# rustlike-ts

Rust-like `Result` and `Option` types for TypeScript.

`rustlike-ts` helps you make failure and absence explicit without throwing everywhere or passing `null` through your app.

## Installation

```bash
npm install rustlike-ts
```

## v2 Highlights

- `map` and `mapErr` are immutable and can change the wrapped type.
- `Option` now includes `fromNullable`, `fromPredicate`, `orElse`, `inspect`, `contains`, `xor`, `toNullable`, and `toUndefined`.
- `Result` now includes `fromThrowable`, `fromPromise`, `tryAsync`, `mapOr`, `mapOrElse`, `inspect`, `inspectErr`, `contains`, and `containsErr`.
- Collection helpers can collect, partition, and traverse arrays of `Option` or `Result`.
- Build output now generates ESM, CJS, minified bundles, and declaration files cleanly.

## Result<T, E>

`Result<T, E>` represents either success with `Ok(T)` or failure with `Err(E)`.

```ts
import { Err, Ok, type Result } from "rustlike-ts";

function divide(a: number, b: number): Result<number, string> {
  if (b === 0) return Err("Division by zero");
  return Ok(a / b);
}

const message = divide(10, 2)
  .map((value) => value.toFixed(1))
  .mapOr("failed", (value) => `result: ${value}`);
```

### Safe throwable code

```ts
import { fromThrowable } from "rustlike-ts";

const parsed = fromThrowable(
  () => JSON.parse(input) as { id: string },
  (error) => (error instanceof Error ? error.message : "Unknown error"),
);
```

### Safe promises

```ts
import { fromPromise } from "rustlike-ts";

const user = await fromPromise(
  fetch("/api/user").then((response) => response.json()),
  (error) => (error instanceof Error ? error.message : "Request failed"),
);
```

```ts
import { tryAsync } from "rustlike-ts";

const user = await tryAsync(
  async () => {
    const response = await fetch("/api/user");
    return response.json();
  },
  (error) => (error instanceof Error ? error.message : "Request failed"),
);
```

### Result methods

- `unwrap()`
- `unwrapErr()`
- `unwrapOr(or)`
- `unwrapOrElse(fn)`
- `expect(message)`
- `expectErr(message)`
- `isOk()`
- `isErr()`
- `ok()`
- `err()`
- `map(fn)`
- `mapErr(fn)`
- `mapOr(fallback, fn)`
- `mapOrElse(fallbackFn, fn)`
- `and(result)`
- `andThen(fn)`
- `or(result)`
- `orElse(fn)`
- `inspect(fn)`
- `inspectErr(fn)`
- `contains(value)`
- `containsErr(error)`

## Option<T>

`Option<T>` represents either a present value with `Some(T)` or absence with `None`.

```ts
import { fromNullable, type Option } from "rustlike-ts";

function findUserName(id: string): Option<string> {
  const user = users.get(id);
  return fromNullable(user?.name);
}

const label = findUserName("1").mapOr("Anonymous", (name) => name.trim());
```

### Predicate conversion

```ts
import { fromPredicate } from "rustlike-ts";

const port = fromPredicate(Number(process.env.PORT), Number.isInteger)
  .filter((value) => value > 0)
  .unwrapOr(3000);
```

### Option methods

- `isSome()`
- `isNone()`
- `unwrap()`
- `expect(message)`
- `unwrapOr(or)`
- `unwrapOrElse(fn)`
- `map(fn)`
- `mapOr(fallback, fn)`
- `mapOrElse(noneFn, someFn)`
- `and(option)`
- `or(option)`
- `orElse(fn)`
- `okOr(error)`
- `okOrElse(fn)`
- `andThen(fn)`
- `filter(fn)`
- `toNullable()`
- `toUndefined()`
- `inspect(fn)`
- `contains(value)`
- `xor(option)`

## Matching

```ts
import { matchOption, matchResult } from "rustlike-ts";

const resultMessage = matchResult(result, {
  Ok: (value) => `Success: ${value}`,
  Err: (error) => `Error: ${error}`,
});

const optionMessage = matchOption(option, {
  Some: (value) => `Found: ${value}`,
  None: () => "Not found",
});
```

## Collection Helpers

```ts
import {
  collectOptions,
  collectResults,
  partitionResults,
  traverseResult,
} from "rustlike-ts";

const ids = collectOptions([fromNullable("a"), fromNullable("b")]);
// Some(["a", "b"])

const values = collectResults([Ok(1), Ok(2), Ok(3)]);
// Ok([1, 2, 3])

const partitioned = partitionResults([Ok(1), Err("bad"), Ok(2)]);
// { values: [1, 2], errors: ["bad"] }

const parsed = traverseResult(["1", "2"], (value) => {
  const number = Number(value);
  return Number.isNaN(number) ? Err(`Invalid number: ${value}`) : Ok(number);
});
```

Available helpers:

- `matchResult`
- `matchOption`
- `mapOption`
- `mapResult`
- `filterMapOption`
- `filterMapResult`
- `collectOptions`
- `collectResults`
- `partitionOptions`
- `partitionResults`
- `traverseOption`
- `traverseResult`
- `flattenOption`
- `flattenResult`

## Breaking Changes in v2

- `map` and `mapErr` no longer mutate the original `Some` / `Ok` / `Err`.
- `map`, `mapErr`, `mapOr`, `mapOrElse`, `and`, and `or` now support changing the wrapped type more naturally.
- `Ok(value)` now returns `Result<T, never>` and `Err(error)` returns `Result<never, E>` for better inference.
