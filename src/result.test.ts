import { test, expect, describe } from "vitest";
import { Err, Ok } from ".";

describe("Result<T,E>", () => {
  describe("Ok<T>", () => {
    const ok = Ok("ok");
    test("unwrap", () => {
      expect(ok.unwrap()).toBe("ok");
    });
    test("unwrapOr", () => {
      expect(ok.unwrapOr("or")).toBe("ok");
    });
    test("unwrapOrElse", () => {
      expect(ok.unwrapOrElse((e) => e)).toBe("ok");
    });
  });

  describe("Err<E,_T>", () => {
    const err = Err("err");
    test("unwrap", () => {
      expect(() => err.unwrap()).toThrowError("panic!!!");
    });
    test("unwrapOr", () => {
      expect(err.unwrapOr("or")).toBe("or");
    });
    test("unwrapOrElse", () => {
      expect(err.unwrapOrElse((e: string) => e)).toBe("err");
    });
  });
});
