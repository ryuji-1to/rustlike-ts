import { describe, expect, test, vi } from "vitest";
import {
  flattenOption,
  fromNullable,
  fromPredicate,
  None,
  type Option,
  OptionError,
  Some,
} from "./option";

function option(isNone: boolean): Option<string> {
  return isNone ? None : Some("some");
}

describe("Option<T>", () => {
  describe("Some<T>", () => {
    test("isSome", () => {
      expect(option(false).isSome()).toBe(true);
    });

    test("isNone", () => {
      expect(option(false).isNone()).toBe(false);
    });

    test("unwrap", () => {
      expect(option(false).unwrap()).toBe("some");
    });

    test("expect", () => {
      expect(option(false).expect("expect")).toBe("some");
    });

    test("unwrapOr", () => {
      expect(option(false).unwrapOr("or")).toBe("some");
    });

    test("unwrapOrElse", () => {
      expect(option(false).unwrapOrElse(() => "or")).toBe("some");
    });

    test("map returns a new option and supports type changes", () => {
      const some = option(false);
      const mapped = some.map((data) => data.length);

      expect(mapped.unwrap()).toBe(4);
      expect(some.unwrap()).toBe("some");
    });

    test("mapOr", () => {
      expect(option(false).mapOr(0, (data) => data.length)).toBe(4);
    });

    test("mapOrElse", () => {
      expect(
        option(false).mapOrElse(
          () => 0,
          (data) => data.length,
        ),
      ).toBe(4);
    });

    test("and", () => {
      expect(option(false).and(Some(10)).unwrap()).toBe(10);
    });

    test("or", () => {
      expect(option(false).or(Some("new some")).unwrap()).toBe("some");
    });

    test("orElse does not call fallback", () => {
      const fallback = vi.fn(() => Some("fallback"));

      expect(option(false).orElse(fallback).unwrap()).toBe("some");
      expect(fallback).not.toHaveBeenCalled();
    });

    test("okOr", () => {
      expect(option(false).okOr("okOr").unwrap()).toBe("some");
    });

    test("okOrElse", () => {
      expect(
        option(false)
          .okOrElse(() => "okOrElse")
          .unwrap(),
      ).toBe("some");
    });

    test("andThen", () => {
      expect(
        option(false)
          .andThen((data) => Some(data.length))
          .unwrap(),
      ).toBe(4);
    });

    test("filter", () => {
      expect(
        option(false)
          .filter((data) => data === "some")
          .isSome(),
      ).toBe(true);
      expect(
        option(false)
          .filter(() => false)
          .isNone(),
      ).toBe(true);
    });

    test("toNullable and toUndefined", () => {
      expect(option(false).toNullable()).toBe("some");
      expect(option(false).toUndefined()).toBe("some");
    });

    test("inspect", () => {
      const inspector = vi.fn();
      const some = option(false);

      expect(some.inspect(inspector)).toBe(some);
      expect(inspector).toHaveBeenCalledWith("some");
    });

    test("contains", () => {
      expect(option(false).contains("some")).toBe(true);
      expect(option(false).contains("other")).toBe(false);
    });

    test("xor", () => {
      expect(option(false).xor(None).unwrap()).toBe("some");
      expect(option(false).xor(Some("other")).isNone()).toBe(true);
    });
  });

  describe("None", () => {
    test("isSome", () => {
      expect(option(true).isSome()).toBe(false);
    });

    test("isNone", () => {
      expect(option(true).isNone()).toBe(true);
    });

    test("unwrap", () => {
      expect(() => option(true).unwrap()).toThrowError(
        "Attempted to unwrap a None value!",
      );
      expect(() => option(true).unwrap()).toThrowError(OptionError);
    });

    test("expect", () => {
      expect(() => option(true).expect("expect called")).toThrowError(
        "expect called",
      );
      expect(() => option(true).expect("expect called")).toThrowError(
        OptionError,
      );
    });

    test("unwrapOr", () => {
      expect(option(true).unwrapOr("99")).toBe("99");
    });

    test("unwrapOrElse", () => {
      expect(option(true).unwrapOrElse(() => "88")).toBe("88");
    });

    test("map", () => {
      expect(
        option(true)
          .map((x) => `${x} mapped`)
          .isNone(),
      ).toBe(true);
    });

    test("mapOr", () => {
      expect(option(true).mapOr("99", (x) => `${x} mapOr`)).toBe("99");
    });

    test("mapOrElse", () => {
      expect(
        option(true).mapOrElse(
          () => "99",
          (x) => `${x} mapOrElse`,
        ),
      ).toBe("99");
    });

    test("and", () => {
      expect(option(true).and(Some("99")).isNone()).toBe(true);
    });

    test("or", () => {
      expect(option(true).or(Some("10")).unwrap()).toBe("10");
    });

    test("orElse", () => {
      const fallback = vi.fn(() => Some("fallback"));

      expect(option(true).orElse(fallback).unwrap()).toBe("fallback");
      expect(fallback).toHaveBeenCalledOnce();
    });

    test("okOr", () => {
      expect(option(true).okOr("okOr").unwrapErr()).toBe("okOr");
    });

    test("okOrElse", () => {
      expect(
        option(true)
          .okOrElse(() => "okOrElse")
          .unwrapErr(),
      ).toBe("okOrElse");
    });

    test("andThen", () => {
      expect(
        option(true)
          .andThen((data) => Some(data.length))
          .isNone(),
      ).toBe(true);
    });

    test("filter", () => {
      expect(
        option(true)
          .filter(() => true)
          .isSome(),
      ).toBe(false);
      expect(
        option(true)
          .filter(() => false)
          .isNone(),
      ).toBe(true);
    });

    test("toNullable and toUndefined", () => {
      expect(option(true).toNullable()).toBeNull();
      expect(option(true).toUndefined()).toBeUndefined();
    });

    test("inspect", () => {
      const inspector = vi.fn();
      const none = option(true);

      expect(none.inspect(inspector)).toBe(none);
      expect(inspector).not.toHaveBeenCalled();
    });

    test("contains", () => {
      expect(option(true).contains("some")).toBe(false);
    });

    test("xor", () => {
      expect(option(true).xor(Some("other")).unwrap()).toBe("other");
      expect(option(true).xor(None).isNone()).toBe(true);
    });
  });
});

describe("Option factories", () => {
  test("fromNullable", () => {
    expect(fromNullable("value").unwrap()).toBe("value");
    expect(fromNullable(null).isNone()).toBe(true);
    expect(fromNullable(undefined).isNone()).toBe(true);
  });

  test("fromPredicate", () => {
    expect(fromPredicate(10, (value) => value > 5).unwrap()).toBe(10);
    expect(fromPredicate(3, (value) => value > 5).isNone()).toBe(true);
  });

  test("flattenOption", () => {
    expect(flattenOption(Some(Some(1))).unwrap()).toBe(1);
    expect(flattenOption(Some(None)).isNone()).toBe(true);
    expect(flattenOption(None).isNone()).toBe(true);
  });
});
