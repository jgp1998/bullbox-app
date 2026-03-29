import { describe, it, expect } from "vitest";
import { calculatePlates } from "../utils/calculator.utils";

describe("PlateBreakdown Logic", () => {
  describe("calculatePlates", () => {
    it("returns empty stack if total weight equals barbell weight (20kg)", () => {
      const stack = calculatePlates(20, "kg", "kg", "Male");
      expect(stack).toEqual([]);
    });

    it("returns empty stack if total weight is less than barbell weight", () => {
      const stack = calculatePlates(15, "kg", "kg", "Male");
      expect(stack).toEqual([]);
    });

    it("calculates correctly for 60kg total weight (20kg barbell + 20kg each side)", () => {
      // 60kg total with 20kg bar = 40kg total plates = 20kg per side.
      // 20kg per side = one 20kg plate per side.
      const stack = calculatePlates(60, "kg", "kg", "Male");
      expect(stack).toHaveLength(1);
      expect(stack[0].weight).toBe(20);
      expect(stack[0].count).toBe(1);
    });

    it("calculates correctly for 100kg total weight (20kg barbell + 40kg each side)", () => {
      // 100kg total with 20kg bar = 80kg total plates = 40kg per side.
      // 40kg per side = one 25kg red and one 15kg yellow.
      const stack = calculatePlates(100, "kg", "kg", "Male");
      expect(stack).toHaveLength(2);
      expect(stack[0].weight).toBe(25);
      expect(stack[1].weight).toBe(15);
    });

    it("calculates correctly for 102.5kg total weight", () => {
      // 102.5kg total with 20kg bar = 82.5kg total plates = 41.25kg per side.
      // 41.25kg per side = one 25kg, one 15kg, one 1.25kg.
      const stack = calculatePlates(102.5, "kg", "kg", "Male");

      // Expected: 25x1, 15x1, 1.25x1
      expect(stack).toHaveLength(3);
      expect(stack.map((p) => p.weight)).toEqual([25, 15, 1.25]);
    });

    it("handles conversion from KG target to LBS plates", () => {
      // 60kg total with 20kg bar = 40kg plates = 20kg plates per side.
      // 20kg per side converted to LBS = 20 * 2.20462 = 44.09 lbs.
      // Using LBS plates: 45 is too big, 35x1, 5x1, 2.5x1, 1.25xXXX...
      // 44.09 - 35 = 9.09
      // 9.09 - 5 = 4.09
      // 4.09 - 2.5 = 1.59
      // 1.59 - 1.25x1...

      const stack = calculatePlates(60, "kg", "lbs", "Male");
      expect(stack.length).toBeGreaterThan(0);
      expect(stack[0].weight).toBe(35);
    });

    it("uses female barbell weight (15kg) correctly", () => {
      // 55kg total with 15kg bar = 40kg plates = 20kg per side.
      const stack = calculatePlates(55, "kg", "kg", "Female");
      expect(stack).toHaveLength(1);
      expect(stack[0].weight).toBe(20);
    });

    it("uses custom barbell weight correctly", () => {
      // 50kg total with 10kg custom bar = 40kg plates = 20kg per side.
      const stack = calculatePlates(50, "kg", "kg", "Male", 10);
      expect(stack).toHaveLength(1);
      expect(stack[0].weight).toBe(20);
    });
  });
});
