import { describe, expect, test } from "vitest";
import { Err, Ok, type Result } from "./result";
import { matchOption, matchResult } from "./utils";
import { Some, None, type Option } from "./option";

function result(isOk: boolean): Result<string, number> {
  if (!isOk) {
    return Err(10);
  }
  return Ok("ok");
}

function option(isSome: boolean): Option<string> {
  if (!isSome) {
    return None;
  }
  return Some("some");
}

describe("matchResult", () => {
  test("Ok", () => {
    const ok = result(true);
    const r = matchResult(ok, {
      Ok: (data) => data,
      Err: (error) => error.toString(),
    });
    expect(r).toBe("ok");
  });
  test("Err", () => {
    const ok = result(false);
    const r = matchResult(ok, {
      Ok: (data) => data,
      Err: (error) => error.toString(),
    });
    expect(r).toBe("10");
  });
});

describe("matchOption", () => {
  test("Ok", () => {
    const some = option(true);
    const r = matchOption(some, {
      Some: (data) => data,
      None: () => "none",
    });
    expect(r).toBe("some");
  });
  test("Err", () => {
    const none = option(false);
    const r = matchOption(none, {
      Some: (data) => data,
      None: () => "none",
    });
    expect(r).toBe("none");
  });
});
