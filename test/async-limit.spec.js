import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import asyncLimit from "../problems/async-limit";

const LIMIT = "Превышен лимит времени исполнения";
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

describe("asyncLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("single argument", async () => {
    const fn = async (n) => {
      await sleep(1000);

      return n * n;
    };

    it("limit is exceeded", async () => {
      const res = asyncLimit(fn, 500)(5);
      await vi.runAllTimersAsync();
      await expect(res).resolves.toBe(LIMIT);
    });

    it("limit is not exceeded", async () => {
      const res = asyncLimit(fn, 1500)(5);
      await vi.runAllTimersAsync();
      await expect(res).resolves.toBe(25);
    });
  });

  describe("two arguments", async () => {
    const fn = async (a, b) => {
      await sleep(1000);

      return a + b;
    };

    it("limit is exceeded", async () => {
      const res = asyncLimit(fn, 500)(1, 2);
      await vi.runAllTimersAsync();
      await expect(res).resolves.toBe(LIMIT);
    });

    it("limit is not exceeded", async () => {
      const res = asyncLimit(fn, 1500)(1, 2);
      await vi.runAllTimersAsync();
      await expect(res).resolves.toBe(3);
    });
  });
});
