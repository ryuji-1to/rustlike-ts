import { describe, expect, test } from "vitest";
import { None, type Option, OptionError, Some } from "./option";

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

    test("expect", () => {
      expect(some.expect("expect")).toBe("some");
    });

    test("unwrapOr", () => {
      expect(some.unwrapOr("or")).toBe("some");
    });

    test("unwrapOrElse", () => {
      expect(some.unwrapOrElse(() => "or")).toBe("some");
    });

    test("map", () => {
      expect(some.map((data) => `mapped ${data}`).unwrap()).toBe("mapped some");
    });

    test("mapOr", () => {
      expect(some.mapOr("or", (data) => data)).toBe("mapped some");
    });

    test("mapOrElse", () => {
      expect(
        some.mapOrElse(
          () => "or",
          (data) => data,
        ),
      ).toBe("mapped some");
    });

    test("and", () => {
      expect(some.and(Some("new some")).unwrap()).toBe("new some");
    });

    test("or", () => {
      expect(some.or(Some("new some")).unwrap()).toBe("mapped some");
    });

    test("okOr", () => {
      expect(some.okOr("okOr").unwrap()).toBe("mapped some");
    });

    test("okOrElse", () => {
      expect(some.okOrElse(() => "okOrElse").unwrap()).toBe("mapped some");
    });

    test("andThen", () => {
      expect(some.andThen((_) => Some(10)).unwrap()).toBe(10);
    });

    test("filter", () => {
      expect(some.filter((data) => data === "mapped some").isSome()).toBe(true);
      expect(some.filter((_) => false).isNone()).toBe(true);
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
        "Attempted to unwrap a None value!",
      );
      expect(() => none.unwrap()).toThrowError(OptionError);
    });

    test("expect", () => {
      expect(() => none.expect("expect called")).toThrowError("expect called");
      expect(() => none.expect("expect called")).toThrowError(OptionError);
    });

    test("unwrapOr", () => {
      expect(none.unwrapOr("99")).toBe("99");
    });

    test("unwrapOrElse", () => {
      expect(none.unwrapOrElse(() => "88")).toBe("88");
    });

    test("map", () => {
      expect(none.map((x) => `${x} mapped`).isNone()).toBe(true);
    });

    test("mapOr", () => {
      expect(none.mapOr("99", (x) => `${x} mapOr`)).toBe("99");
    });

    test("mapOrElse", () => {
      expect(
        none.mapOrElse(
          () => "99",
          (x) => `${x} mapOrElse`,
        ),
      ).toBe("99");
    });

    test("and", () => {
      expect(none.and(Some("99")).isNone()).toBe(true);
    });

    test("or", () => {
      expect(none.or(Some("10")).unwrap()).toBe("10");
    });

    test("okOr", () => {
      expect(none.okOr("okOr").unwrapErr()).toBe("okOr");
    });

    test("okOrElse", () => {
      expect(none.okOrElse(() => "okOrElse").unwrapErr()).toBe("okOrElse");
    });

    test("andThen", () => {
      expect(none.andThen((data) => Some(data.length)).isNone()).toBe(true);
    });

    test("filter", () => {
      expect(none.filter(() => true).isSome()).toBe(false);
      expect(none.filter(() => false).isNone()).toBe(true);
    });
  });
});
