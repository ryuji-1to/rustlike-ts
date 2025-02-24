import { test, expect, describe } from "vitest";
import { err, match, ok } from ".";

test("ok fn", () => {
  expect(ok("ok")).toStrictEqual({ isOk: true, data: "ok" });
});

test("err fn", () => {
  expect(err("err")).toStrictEqual({ isOk: false, error: "err" });
});

test("match fn", () => {
  const result_ok = ok("ok");
  expect(
    match(
      result_ok,
      (data) => data,
      (_) => _
    )
  ).toBe("ok");

  const result_err = err("err");
  expect(
    match(
      result_err,
      (_) => _,
      (error) => error
    )
  ).toBe("err");
});
