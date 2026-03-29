import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useWorkouts, useExercises } from "../index";
import { useRecords } from "@/src/features/records";
import { useWorkoutStore } from "../store/useWorkoutStore";

// Mock dependencies
vi.mock("@/src/features/records", () => ({
  useRecords: vi.fn(),
}));

vi.mock("../store/useWorkoutStore", () => ({
  useWorkoutStore: vi.fn(),
}));

describe("Workout Feature Hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("useWorkouts", () => {
    it("should delegate to useRecords", () => {
      const mockRecords = [{ id: "1", exercise: "Squat" }];
      const mockAddRecord = vi.fn();
      const mockDeleteRecord = vi.fn();
      const mockBests = [{ id: "1", exercise: "Squat", weight: 100 }];

      (useRecords as any).mockReturnValue({
        records: mockRecords,
        addRecord: mockAddRecord,
        deleteRecord: mockDeleteRecord,
        personalBests: mockBests,
        isLoading: false,
      });

      const { result } = renderHook(() => useWorkouts());

      expect(result.current.records).toEqual(mockRecords);
      expect(result.current.personalBests).toEqual(mockBests);
      expect(result.current.addRecord).toBe(mockAddRecord);
      expect(result.current.deleteRecord).toBe(mockDeleteRecord);
    });
  });

  describe("useExercises", () => {
    it("should delegate to useWorkoutStore", () => {
      const mockExercises = ["Squat", "Bench Press"];
      const mockAddExercise = vi.fn();
      const mockDeleteExercise = vi.fn();

      (useWorkoutStore as any).mockReturnValue({
        exercises: mockExercises,
        addExercise: mockAddExercise,
        deleteExercise: mockDeleteExercise,
        isLoading: false,
      });

      const { result } = renderHook(() => useExercises());

      expect(result.current.exercises).toEqual(mockExercises);
      expect(result.current.addExercise).toBe(mockAddExercise);
      expect(result.current.deleteExercise).toBe(mockDeleteExercise);
    });
  });
});
