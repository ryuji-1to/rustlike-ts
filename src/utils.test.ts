import { describe, expect, test } from "vitest";
import { Err, Ok, type Result } from "./result";
import {
  filterMapOption,
  filterMapResult,
  mapOption,
  mapResult,
  matchOption,
  matchResult,
} from "./utils";
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

describe("mapOption", () => {
  test("Some case", () => {
    const data = [Some(1), Some(2), Some(3)];
    const result = mapOption(data, (x) => x * 2);
    expect(result).toEqual([Some(2), Some(4), Some(6)]);
  });

  test("None case", () => {
    const data = [None, Some(2), None];
    const result = mapOption(data, (x) => x * 2);
    expect(result).toEqual([None, Some(4), None]);
  });
});

describe("mapResult", () => {
  test("Ok case", () => {
    const data = [Ok(1), Ok(2), Ok(3)];
    const result = mapResult(data, (x) => x * 2);
    expect(result).toEqual([Ok(2), Ok(4), Ok(6)]);
  });

  test("Err case", () => {
    const data = [Err("error1"), Ok(2), Err("error2")];
    const result = mapResult(data, (x) => x * 2);
    expect(result).toEqual([Err("error1"), Ok(4), Err("error2")]);
  });
});

describe("filterMapOption", () => {
  test("Some case", () => {
    const data = [Some(1), Some(2), Some(3)];
    const result = filterMapOption(data, (x) =>
      x % 2 === 0 ? Some(x * 2) : None
    );
    expect(result).toEqual([Some(4)]);
  });

  test("None case", () => {
    const data = [None, Some(3), Some(5)];
    const result = filterMapOption(data, (x) =>
      x % 2 === 0 ? Some(x * 2) : None
    );
    expect(result).toEqual([]);
  });
});

describe("filterMapResult", () => {
  test("Ok case", () => {
    const data = [Ok(1), Ok(2), Ok(3)];
    const result = filterMapResult(data, (x) =>
      x % 2 === 0 ? Ok(x * 2) : Err("filtered")
    );
    expect(result).toEqual([Ok(4)]);
  });

  test("Err case", () => {
    const data = [Err("error1"), Ok(3), Ok(5)];
    const result = filterMapResult(data, (x) =>
      x % 2 === 0 ? Ok(x * 2) : Err("filtered")
    );
    expect(result).toEqual([]);
  });
});
