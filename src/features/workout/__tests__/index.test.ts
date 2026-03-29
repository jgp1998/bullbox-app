import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useWorkouts, useExercises } from "../index";
import { useRecords } from "@/src/features/records";
import { useWorkoutStore } from "../store/useWorkoutStore";
import { useAuthStore } from "../../auth/store/useAuthStore";

// Mock dependencies
vi.mock("@/src/features/records", () => ({
  useRecords: vi.fn(),
}));

vi.mock("../store/useWorkoutStore", () => ({
  useWorkoutStore: vi.fn(),
}));

vi.mock("../../auth/store/useAuthStore", () => ({
  useAuthStore: vi.fn(),
}));

describe("Workout Feature Hooks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as any).mockReturnValue({ user: { uid: "test-uid" } });
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
    it("should delegate to useWorkoutStore", async () => {
      const mockExercises = ["Squat", "Bench Press"];
      const mockAddExercise = vi.fn();
      const mockDeleteExercise = vi.fn();
      const mockInitialize = vi.fn(() => () => {});

      (useWorkoutStore as any).mockReturnValue({
        exercises: mockExercises,
        addExercise: mockAddExercise,
        deleteExercise: mockDeleteExercise,
        initialize: mockInitialize,
        isLoading: false,
      });

      const { result } = renderHook(() => useExercises());

      expect(result.current.exercises).toEqual(mockExercises);
      
      await act(async () => {
          await result.current.addExercise("New Exercise");
      });
      expect(mockAddExercise).toHaveBeenCalledWith("New Exercise", "test-uid");

      await act(async () => {
          await result.current.deleteExercise("Squat");
      });
      expect(mockDeleteExercise).toHaveBeenCalledWith("Squat", "test-uid");
    });
  });
});
