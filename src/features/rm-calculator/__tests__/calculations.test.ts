import { describe, it, expect } from "vitest";
import { calculate1RM, calculatePercentage } from "@/shared/utils/calculator";

describe("RM Calculations", () => {
  describe("calculate1RM (Epley Formula)", () => {
    it("should return 0 if weight is 0", () => {
      expect(calculate1RM(0, 10)).toBe(0);
    });

    it("should return weight if weight is provided and reps is 0", () => {
      expect(calculate1RM(100, 0)).toBe(100);
    });

    it("should return weight if weight is provided and reps is 1", () => {
      expect(calculate1RM(100, 1)).toBe(100);
    });

    it("should calculate correctly for 10 reps", () => {
      // Formula: 100 * (1 + 10/30) = 100 * (1 + 0.333) = 133.333
      const result = calculate1RM(100, 10);
      expect(result).toBeCloseTo(133.333, 3);
    });

    it("should calculate correctly for 5 reps", () => {
      // Formula: 100 * (1 + 5/30) = 100 * (1 + 0.166...) = 116.666
      const result = calculate1RM(100, 5);
      expect(result).toBeCloseTo(116.667, 3);
    });

    it("should handle undefined parameters", () => {
      expect(calculate1RM(undefined, 10)).toBe(0);
      expect(calculate1RM(100, undefined)).toBe(100);
    });
  });

  describe("calculatePercentage", () => {
    it("should calculate percentage correctly", () => {
      expect(calculatePercentage(100, 80)).toBe(80);
      expect(calculatePercentage(150, 50)).toBe(75);
      expect(calculatePercentage(200, 110)).toBe(220);
    });

    it("should return 0 if max is 0", () => {
      expect(calculatePercentage(0, 80)).toBe(0);
    });
  });
});
