import { describe, it, expect } from 'vitest';
import { calculate1RM, calculatePercentage } from '@/shared/utils/calculator';

describe('RM Calculator Logic', () => {
  it('Epley formula accuracy', () => {
    // 100kg for 1 reps should be 100
    expect(calculate1RM(100, 1)).toBe(100);
    // 100kg for 10 reps should be 100 * (1 + 10/30) = 133.33
    expect(calculate1RM(100, 10)).toBeCloseTo(133.333, 2);
    // 60kg for 5 reps should be 60 * (1 + 5/30) = 70
    expect(calculate1RM(60, 5)).toBe(70);
  });

  it('Percentage table data consistency', () => {
    const max = 150; // 150kg
    // 50% of 150 should be 75
    expect(calculatePercentage(max, 50)).toBe(75);
    // 85% of 150 should be 127.5
    expect(calculatePercentage(max, 85)).toBe(127.5);
    // 105% of 150 should be 157.5
    expect(calculatePercentage(max, 105)).toBe(157.5);
  });

  it('Edge cases and invalid inputs', () => {
    // 0 weight should return 0 1RM
    expect(calculate1RM(0, 5)).toBe(0);
    // undefined weight should return 0 1RM
    expect(calculate1RM(undefined, 5)).toBe(0);
    // 0 reps should return weight (as if it was 1RM)
    expect(calculate1RM(100, 0)).toBe(100);
    // negative reps should return weight
    expect(calculate1RM(100, -5)).toBe(100);
  });
});
