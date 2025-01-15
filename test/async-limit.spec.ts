import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import asyncLimit from '../problems/async-limit';

const LIMIT_TEXT = 'Превышен лимит времени исполнения';
const DELAY_MS = 1000;
const LIMIT_LOW_MS = 500;
const LIMIT_HIGH_MS = 1500;

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function delay<A extends unknown[], R>(fn: (...args: A) => Promise<R>, ms: number): (...args: A) => Promise<R> {
  return async (...args) => {
    await sleep(ms);

    return fn(...args);
  };
}

function generateArgs(length: number): number[][] {
  const argsList: number[][] = [];

  for (let i = 0; i < length; i += 1) {
    argsList[i] = [];

    for (let j = length; j > i; j -= 1) {
      argsList[i].push(j - i);
    }
  }

  return argsList;
}

describe('asyncLimit', () => {
  const argsList = generateArgs(100);

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('single argument', async () => {
    const fn = async (n: number) => n * n;

    it('limit is exceeded', async () => {
      const [n] = argsList[0];

      const promise = asyncLimit(delay(fn, DELAY_MS), LIMIT_LOW_MS)(n);

      vi.runOnlyPendingTimersAsync();
      await expect(promise).rejects.toThrow(LIMIT_TEXT);
    });

    it('limit is not exceeded', async () => {
      for (const [n] of argsList) {
        const promise = asyncLimit(delay(fn, DELAY_MS), LIMIT_HIGH_MS)(n);

        await vi.runOnlyPendingTimersAsync();
        await expect(promise).resolves.toBe(fn(n));
      }
    });
  });

  describe('two arguments', async () => {
    const fn = async (a: number, b: number) => a + b;

    it('limit is exceeded', async () => {
      const [a, b] = argsList[0];

      const promise = asyncLimit(delay(fn, DELAY_MS), LIMIT_LOW_MS)(a, b);

      vi.runOnlyPendingTimersAsync();
      await expect(promise).rejects.toThrow(LIMIT_TEXT);
    });

    it('limit is not exceeded', async () => {
      for (const [a, b] of argsList.slice(0, -1)) {
        const promise = asyncLimit(delay(fn, DELAY_MS), LIMIT_HIGH_MS)(a, b);

        await vi.runOnlyPendingTimersAsync();
        await expect(promise).resolves.toBe(fn(a, b));
      }
    });
  });

  describe('more arguments', async () => {
    const fn = async (...args: number[]) => args.join();

    it('limit is exceeded', async () => {
      const args = argsList[0];

      const promise = asyncLimit(delay(fn, DELAY_MS), LIMIT_LOW_MS)(...args);

      vi.runOnlyPendingTimersAsync();
      await expect(promise).rejects.toThrow(LIMIT_TEXT);
    });

    it('limit is not exceeded', async () => {
      for (const args of argsList) {
        const promise = asyncLimit(delay(fn, DELAY_MS), LIMIT_HIGH_MS)(...args);

        await vi.runOnlyPendingTimersAsync();
        await expect(promise).resolves.toBe(fn(...args));
      }
    });
  });
});
