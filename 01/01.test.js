import { describe, expect, test } from "vitest";

async function asyncFunc(p1, p2) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve(p1 + p2), 1000);
  });
}

describe("this is a first test", () => {
  test("func", () => {
    expect(Math.sqrt(16)).toBe(4);
  });

  test("async", async () => {
    const res = await asyncFunc(10, 20);
    expect(res).toBe(30);
  });
});
