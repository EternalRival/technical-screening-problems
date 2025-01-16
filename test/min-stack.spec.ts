import { describe, expect, it } from 'vitest';
import MinStack from '../problems/min-stack';

describe('min-stack', () => {
  it('pop should update min value', () => {
    const stack = new MinStack();

    stack.push(1);
    stack.push(0);
    stack.push(3);

    expect(stack.pop()).toBe(3);
    expect(stack.getMin()).toBe(0);
    expect(stack.pop()).toBe(0);
    expect(stack.getMin()).toBe(1);
  });
});
