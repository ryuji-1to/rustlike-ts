import { describe, expect, test } from "vitest";
import { Err, Ok, type Result } from "./result";
import {
  collectOptions,
  collectResults,
  filterMapOption,
  filterMapResult,
  mapOption,
  mapResult,
  matchOption,
  matchResult,
  partitionOptions,
  partitionResults,
  traverseOption,
  traverseResult,
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
      x % 2 === 0 ? Some(x * 2) : None,
    );
    expect(result).toEqual([Some(4)]);
  });

  test("None case", () => {
    const data = [None, Some(3), Some(5)];
    const result = filterMapOption(data, (x) =>
      x % 2 === 0 ? Some(x * 2) : None,
    );
    expect(result).toEqual([]);
  });
});

describe("filterMapResult", () => {
  test("Ok case", () => {
    const data = [Ok(1), Ok(2), Ok(3)];
    const result = filterMapResult(data, (x) =>
      x % 2 === 0 ? Ok(x * 2) : Err("filtered"),
    );
    expect(result).toEqual([Ok(4)]);
  });

  test("Err case", () => {
    const data = [Err("error1"), Ok(3), Ok(5)];
    const result = filterMapResult(data, (x) =>
      x % 2 === 0 ? Ok(x * 2) : Err("filtered"),
    );
    expect(result).toEqual([]);
  });
});

describe("collectOptions", () => {
  test("Some case", () => {
    expect(collectOptions([Some(1), Some(2), Some(3)]).unwrap()).toEqual([
      1, 2, 3,
    ]);
  });

  test("None case", () => {
    expect(collectOptions([Some(1), None, Some(3)]).isNone()).toBe(true);
  });
});

describe("collectResults", () => {
  test("Ok case", () => {
    expect(collectResults([Ok(1), Ok(2), Ok(3)]).unwrap()).toEqual([1, 2, 3]);
  });

  test("Err case", () => {
    expect(collectResults([Ok(1), Err("error"), Ok(3)]).unwrapErr()).toBe(
      "error",
    );
  });
});

describe("partitionOptions", () => {
  test("splits values and none count", () => {
    expect(partitionOptions([Some(1), None, Some(2), None])).toEqual({
      values: [1, 2],
      noneCount: 2,
    });
  });
});

describe("partitionResults", () => {
  test("splits values and errors", () => {
    expect(partitionResults([Ok(1), Err("a"), Ok(2), Err("b")])).toEqual({
      values: [1, 2],
      errors: ["a", "b"],
    });
  });
});

describe("traverseOption", () => {
  test("collects mapped options", () => {
    expect(
      traverseOption([1, 2, 3], (value) =>
        value > 0 ? Some(value * 2) : None,
      ).unwrap(),
    ).toEqual([2, 4, 6]);
  });

  test("returns None when mapped option is None", () => {
    expect(
      traverseOption([1, -1, 3], (value) =>
        value > 0 ? Some(value * 2) : None,
      ).isNone(),
    ).toBe(true);
  });
});

describe("traverseResult", () => {
  test("collects mapped results", () => {
    expect(
      traverseResult([1, 2, 3], (value) =>
        value > 0 ? Ok(value * 2) : Err("negative"),
      ).unwrap(),
    ).toEqual([2, 4, 6]);
  });

  test("returns first Err when mapped result is Err", () => {
    expect(
      traverseResult([1, -1, 3], (value) =>
        value > 0 ? Ok(value * 2) : Err("negative"),
      ).unwrapErr(),
    ).toBe("negative");
  });
});
