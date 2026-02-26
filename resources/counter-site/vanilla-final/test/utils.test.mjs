import { describe, it, expect, vi } from "vitest";
import { debounce, paramsToObj } from "../public/utils.mjs";

describe("debounce", () => {
  it("should debounce the function call", async () => {
    vi.useFakeTimers();
    const func = vi.fn();
    const debouncedFunc = debounce(100, func);

    debouncedFunc();
    debouncedFunc();
    debouncedFunc();

    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(99);
    expect(func).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1);
    expect(func).toHaveBeenCalledTimes(1);

    vi.useRealTimers();
  });

  it("should pass arguments to the debounced function", async () => {
    vi.useFakeTimers();
    const func = vi.fn();
    const debouncedFunc = debounce(100, func);

    debouncedFunc(1, 2);
    vi.advanceTimersByTime(100);

    expect(func).toHaveBeenCalledWith(1, 2);
    vi.useRealTimers();
  });
});

describe("paramsToObj", () => {
  it("should convert URLSearchParams to an object", () => {
    const params = new URLSearchParams("count=10&userInput=20");
    const obj = paramsToObj(params);
    expect(obj).toEqual({ count: "10", userInput: "20" });
  });

  it("should apply transformations", () => {
    const params = new URLSearchParams("count=10&userInput=20");
    const xforms = {
      count: Number,
      userInput: Number,
    };
    const obj = paramsToObj(params, xforms);
    expect(obj).toEqual({ count: 10, userInput: 20 });
  });

  it("should handle multiple values for the same key", () => {
    const params = new URLSearchParams("tag=a&tag=b&tag=c");
    const obj = paramsToObj(params);
    expect(obj).toEqual({ tag: ["a", "b", "c"] });
  });

  it("should handle mixed transformations and multiple values", () => {
    const params = new URLSearchParams("id=1&name=test&id=2");
    const xforms = {
      id: Number,
    };
    const obj = paramsToObj(params, xforms);
    expect(obj).toEqual({ id: [1, 2], name: "test" });
  });

  it("should return an empty object for empty params", () => {
    const params = new URLSearchParams("");
    const obj = paramsToObj(params);
    expect(obj).toEqual({});
  });
});
