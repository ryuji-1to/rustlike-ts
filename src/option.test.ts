import { describe, expect, test } from "vitest";
import { None, Option, Some } from "./option";

function result(isNone: boolean): Option<string> {
  return isNone ? None : Some("some");
}

describe("Option<T>", () => {
  describe("Some<T>", () => {
    const some = result(false);
    test("isSome", () => {
      expect(some.isSome()).toBe(true);
    });
    test("isNone", () => {
      expect(some.isNone()).toBe(false);
    });
    test("unwrap", () => {
      expect(some.unwrap()).toBe("some");
    });
    test("unwrapOr", () => {
      expect(some.unwrapOr("or")).toBe("some");
    });
    test("unwrapOrElse", () => {
      expect(some.unwrapOrElse(() => "or")).toBe("some");
    });
    test("map", () => {
      expect(some.map((data) => "mapped " + data).unwrap()).toBe("mapped some");
    });
    test("mapOr", () => {
      expect(some.mapOr("or", (data) => data)).toBe("mapped some");
    });
    test("mapOrElse", () => {
      expect(
        some.mapOrElse(
          () => "or",
          (data) => data
        )
      ).toBe("mapped some");
    });
    test("and", () => {
      expect(some.and(Some("new some")).unwrap()).toBe("new some");
    });
    test("or", () => {
      expect(some.or(Some("new some")).unwrap()).toBe("mapped some");
    });
  });

  describe("None", () => {
    const none = result(true);
    test("isSome", () => {
      expect(none.isSome()).toBe(false);
    });

    test("isNone", () => {
      expect(none.isNone()).toBe(true);
    });

    test("unwrap", () => {
      expect(() => none.unwrap()).toThrowError(
        "Attempted to unwrap a None value!"
      );
    });

    test("unwrapOr", () => {
      expect(none.unwrapOr("99")).toBe("99");
    });

    test("unwrapOrElse", () => {
      expect(none.unwrapOrElse(() => "88")).toBe("88");
    });

    test("map", () => {
      expect(none.map((x) => x + "mapped").isNone()).toBe(true);
    });

    test("mapOr", () => {
      expect(none.mapOr("99", (x) => x + "mapOr")).toBe("99");
    });

    test("mapOrElse", () => {
      expect(
        none.mapOrElse(
          () => "99",
          (x) => x + "mapOrElse"
        )
      ).toBe("99");
    });

    test("and", () => {
      expect(none.and(Some("99")).isNone()).toBe(true);
    });

    test("or", () => {
      expect(none.or(Some("10")).unwrap()).toBe("10");
    });
  });
});
