import { get, patch } from "../lib/patcher";

describe("patch", () => {
  it("should return the value at the given path", () => {
    const obj = { a: { b: { c: 1 } } };
    const path = "a.b.c";
    const result = get(obj, path, true);
    expect(result).toBe(1);
  });

  it("should return the value at the given path when there is array", () => {
    const obj = { a: { b: { c: [{ a: 1 }, { a: 2 }, { a: 3 }] } } };
    expect(get(obj, "a.b.c[2]", true)).toEqual({ a: 3 });
    expect(get(obj, "a.b.c[2]")).toEqual([{ a: 3 }]);
    expect(get(obj, "a.b.c[*].a")).toEqual([1, 2, 3]);
  });

  it("should return a new object with the patch applied to the specified path when the path exists", () => {
    const obj = { name: "John", age: 30 };
    const patchObj = { path: "$.name", value: "Jane" };
    const result = patch(obj, patchObj);

    expect(result).toEqual({ name: "Jane", age: 30 });
  });

  it("should return a new object with the patch applied to the specified path when the path exists", () => {
    const initial = {
      name: "John",
      age: 30,
      elements: [
        { value: 10, name: "foo" },
        { value: 20, name: "bar" },
      ],
    };

    const final = {
      name: "John",
      age: 30,
      elements: [
        { value: 5, name: "foo" },
        { value: 5, name: "bar" },
      ],
    };

    const patchObj = { path: "$.elements.*.value", value: 5 };
    const result = patch(initial, patchObj);

    expect(result).toEqual(final);
  });
});
