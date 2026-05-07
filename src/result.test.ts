import { describe, expect, test, vi } from "vitest";
import {
  Err,
  flattenResult,
  fromPromise,
  fromThrowable,
  Ok,
  type Result,
  ResultError,
  tryAsync,
} from ".";

function result(isOk: boolean): Result<string, string> {
  return isOk ? Ok("ok") : Err("err");
}

describe("Result<T,E>", () => {
  describe("Ok<T>", () => {
    test("unwrap", () => {
      expect(result(true).unwrap()).toBe("ok");
    });

    test("unwrapErr", () => {
      expect(() => result(true).unwrapErr()).toThrowError(
        `Called unwrapErr() on an Ok value: "ok"`,
      );
      expect(() => result(true).unwrapErr()).toThrowError(ResultError);
    });

    test("unwrapOr", () => {
      expect(result(true).unwrapOr("or")).toBe("ok");
    });

    test("unwrapOrElse", () => {
      expect(result(true).unwrapOrElse((e) => e)).toBe("ok");
    });

    test("expect", () => {
      expect(result(true).expect("this will not be called")).toBe("ok");
    });

    test("expectErr", () => {
      expect(() =>
        result(true).expectErr("this should be called"),
      ).toThrowError("this should be called");
    });

    test("isOk", () => {
      expect(result(true).isOk()).toBe(true);
    });

    test("isErr", () => {
      expect(result(true).isErr()).toBe(false);
    });

    test("ok", () => {
      expect(result(true).ok().isSome()).toBe(true);
      expect(result(true).ok().unwrap()).toBe("ok");
    });

    test("err", () => {
      expect(result(true).err().isNone()).toBe(true);
    });

    test("map returns a new result and supports type changes", () => {
      const ok = result(true);
      const mapped = ok.map((data) => data.length);

      expect(mapped.unwrap()).toBe(2);
      expect(ok.unwrap()).toBe("ok");
    });

    test("mapErr", () => {
      expect(
        result(true)
          .mapErr((data) => `mapErr ${data}`)
          .unwrap(),
      ).toBe("ok");
    });

    test("mapOr", () => {
      expect(result(true).mapOr(0, (data) => data.length)).toBe(2);
    });

    test("mapOrElse", () => {
      expect(
        result(true).mapOrElse(
          () => 0,
          (data) => data.length,
        ),
      ).toBe(2);
    });

    test("and", () => {
      expect(result(true).and(Ok(10)).unwrap()).toBe(10);
    });

    test("andThen", () => {
      expect(
        result(true)
          .andThen((_) => Ok(10))
          .unwrap(),
      ).toBe(10);
    });

    test("or", () => {
      expect(result(true).or(Ok("not ok")).unwrap()).toBe("ok");
    });

    test("orElse", () => {
      expect(
        result(true)
          .orElse((_error) => Err(10))
          .unwrap(),
      ).toBe("ok");
    });

    test("inspect", () => {
      const inspector = vi.fn();
      const ok = result(true);

      expect(ok.inspect(inspector)).toBe(ok);
      expect(inspector).toHaveBeenCalledWith("ok");
    });

    test("inspectErr", () => {
      const inspector = vi.fn();
      const ok = result(true);

      expect(ok.inspectErr(inspector)).toBe(ok);
      expect(inspector).not.toHaveBeenCalled();
    });

    test("contains", () => {
      expect(result(true).contains("ok")).toBe(true);
      expect(result(true).contains("other")).toBe(false);
    });

    test("containsErr", () => {
      expect(result(true).containsErr("err")).toBe(false);
    });
  });

  describe("Err<E,_T>", () => {
    test("unwrap", () => {
      expect(() => result(false).unwrap()).toThrowError(
        `Called unwrap() on an Err value: "err"`,
      );
      expect(() => result(false).unwrap()).toThrowError(ResultError);
    });

    test("unwrapErr", () => {
      expect(result(false).unwrapErr()).toBe("err");
    });

    test("unwrapOr", () => {
      expect(result(false).unwrapOr("or")).toBe("or");
    });

    test("unwrapOrElse", () => {
      expect(result(false).unwrapOrElse((e: string) => e)).toBe("err");
    });

    test("expect", () => {
      expect(() => result(false).expect("this should be called")).toThrowError(
        "this should be called",
      );
      expect(() => result(false).expect("this should be called")).toThrowError(
        ResultError,
      );
    });

    test("expectErr", () => {
      expect(result(false).expectErr("this should not be called")).toBe("err");
    });

    test("isOk", () => {
      expect(result(false).isOk()).toBe(false);
    });

    test("isErr", () => {
      expect(result(false).isErr()).toBe(true);
    });

    test("ok", () => {
      expect(result(false).ok().isNone()).toBe(true);
    });

    test("err", () => {
      expect(result(false).err().isSome()).toBe(true);
      expect(result(false).err().unwrap()).toBe("err");
    });

    test("map", () => {
      expect(() =>
        result(false)
          .map(() => "mapped")
          .unwrap(),
      ).toThrowError('Called unwrap() on an Err value: "err"');
    });

    test("mapErr returns a new result and supports type changes", () => {
      const err = result(false);
      const mapped = err.mapErr((e) => e.length);

      expect(mapped.unwrapErr()).toBe(3);
      expect(err.unwrapErr()).toBe("err");
    });

    test("mapOr", () => {
      expect(result(false).mapOr(0, (data) => data.length)).toBe(0);
    });

    test("mapOrElse", () => {
      expect(
        result(false).mapOrElse(
          (error) => error.length,
          (data) => data.length,
        ),
      ).toBe(3);
    });

    test("and", () => {
      expect(result(false).and(Ok("not ok")).isErr()).toBe(true);
    });

    test("andThen", () => {
      expect(
        result(false)
          .andThen((_data) => Ok(10))
          .unwrapOr(11),
      ).toBe(11);
    });

    test("or", () => {
      expect(result(false).or(Ok("ok")).isOk()).toBe(true);
    });

    test("orElse", () => {
      expect(
        result(false)
          .orElse((_) => Err(10))
          .expectErr("hoge"),
      ).toBe(10);
    });

    test("inspect", () => {
      const inspector = vi.fn();
      const err = result(false);

      expect(err.inspect(inspector)).toBe(err);
      expect(inspector).not.toHaveBeenCalled();
    });

    test("inspectErr", () => {
      const inspector = vi.fn();
      const err = result(false);

      expect(err.inspectErr(inspector)).toBe(err);
      expect(inspector).toHaveBeenCalledWith("err");
    });

    test("contains", () => {
      expect(result(false).contains("ok")).toBe(false);
    });

    test("containsErr", () => {
      expect(result(false).containsErr("err")).toBe(true);
      expect(result(false).containsErr("other")).toBe(false);
    });
  });
});

describe("Result factories", () => {
  test("fromThrowable", () => {
    expect(fromThrowable(() => JSON.parse('{"ok":true}')).unwrap()).toEqual({
      ok: true,
    });

    const parsed = fromThrowable(
      () => JSON.parse("{"),
      (error) => (error instanceof Error ? error.message : "unknown"),
    );

    expect(parsed.isErr()).toBe(true);
    expect(parsed.unwrapErr()).toContain("JSON");
  });

  test("fromPromise", async () => {
    await expect(fromPromise(Promise.resolve(1))).resolves.toEqual(Ok(1));

    const rejected = await fromPromise(
      Promise.reject(new Error("nope")),
      (error) => (error instanceof Error ? error.message : "unknown"),
    );

    expect(rejected.unwrapErr()).toBe("nope");
  });

  test("tryAsync", async () => {
    await expect(tryAsync(async () => 1)).resolves.toEqual(Ok(1));

    const rejected = await tryAsync(
      async () => {
        throw new Error("async nope");
      },
      (error) => (error instanceof Error ? error.message : "unknown"),
    );

    expect(rejected.unwrapErr()).toBe("async nope");
  });

  test("flattenResult", () => {
    expect(flattenResult(Ok(Ok(1))).unwrap()).toBe(1);
    expect(flattenResult(Ok(Err("inner"))).unwrapErr()).toBe("inner");
    expect(flattenResult(Err("outer")).unwrapErr()).toBe("outer");
  });
});
