import { describe, expect, test } from "vitest";
import { Err, Ok, Result } from "./result";
import { matchOption, matchResult } from "./utils";
import { None, Option, Some } from "./option";

function result(isOk: boolean): Result<string, number> {
  if (isOk) {
    return Ok("ok");
  } else {
    return Err(10);
  }
}

function option(isSome: boolean): Option<string> {
  if (isSome) {
    return Some("some");
  } else {
    return None;
  }
}

describe("matchResult", () => {
  test("Ok", () => {
    const ok = result(true);
    const r = matchResult(
      ok,
      (data) => data,
      (error) => error.toString()
    );
    expect(r).toBe("ok");
  });
  test("Err", () => {
    const ok = result(false);
    const r = matchResult(
      ok,
      (data) => data,
      (error) => error.toString()
    );
    expect(r).toBe("10");
  });
});

describe("matchOption", () => {
  test("Ok", () => {
    const some = option(true);
    const r = matchOption(
      some,
      (data) => data,
      () => "none"
    );
    expect(r).toBe("some");
  });
  test("Err", () => {
    const none = option(false);
    const r = matchOption(
      none,
      (data) => data,
      () => "none"
    );
    expect(r).toBe("none");
  });
});
