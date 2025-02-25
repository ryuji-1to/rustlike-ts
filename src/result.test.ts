import { test, expect, describe } from "vitest";
import { Err, Ok, Result } from ".";

function run(isOk: boolean): Result<string, string> {
  return isOk ? Ok("ok") : Err("err");
}

describe("Result<T,E>", () => {
  describe("Ok<T>", () => {
    const ok = run(true);
    test("unwrap", () => {
      expect(ok.unwrap()).toBe("ok");
    });
    test("unwrapOr", () => {
      expect(ok.unwrapOr("or")).toBe("ok");
    });
    test("unwrapOrElse", () => {
      expect(ok.unwrapOrElse((e) => e)).toBe("ok");
    });
    test("expect", () => {
      expect(ok.expect("this will not called")).toBe("ok");
    });
    test("expectErr", () => {
      expect(() => ok.expectErr("this should be called")).toThrowError(
        "this should be called"
      );
    });
    test("isOk", () => {
      expect(ok.isOk()).toBe(true);
    });
    test("isErr", () => {
      expect(ok.isErr()).toBe(false);
    });
    test("map", () => {
      expect(ok.map((data) => "mapped " + data).unwrap()).toBe("mapped ok");
    });
    test("mapErr", () => {
      expect(ok.mapErr((data) => "mapErr " + data).unwrap()).toBe("mapped ok");
    });
    test("andThen", () => {
      expect(ok.andThen((_) => Ok(10)).unwrap()).toBe(10);
    });
    test("orElse", () => {
      expect(ok.orElse((_error) => Err(10)).unwrap()).toBe("mapped ok");
    });
  });

  describe("Err<E,_T>", () => {
    const err = run(false);
    test("unwrap", () => {
      expect(() => err.unwrap()).toThrowError(
        'Called unwrap() on an Err value: "err"'
      );
    });
    test("unwrapOr", () => {
      expect(err.unwrapOr("or")).toBe("or");
    });
    test("unwrapOrElse", () => {
      expect(err.unwrapOrElse((e: string) => e)).toBe("err");
    });
    test("expect", () => {
      expect(() => err.expect("this should be called")).toThrowError(
        "this should be called"
      );
    });
    test("expectErr", () => {
      expect(err.expectErr("this should not be called")).toBe("err");
    });
    test("isOk", () => {
      expect(err.isOk()).toBe(false);
    });
    test("isErr", () => {
      expect(err.isErr()).toBe(true);
    });
    test("map", () => {
      expect(() => err.map(() => "mapped").unwrap()).toThrowError(
        'Called unwrap() on an Err value: "err"'
      );
    });
    test("map", () => {
      expect(err.mapErr((e) => "mapErr " + e).unwrapOrElse((e) => e)).toBe(
        "mapErr err"
      );
    });
    test("andThen", () => {
      expect(err.andThen((_data) => Ok(10)).unwrapOr(11)).toBe(11);
    });
    test("orElse", () => {
      expect(err.orElse((_) => Err(10)).expectErr("hoge")).toBe(10);
    });
  });
});
