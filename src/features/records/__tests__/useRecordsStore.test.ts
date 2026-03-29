import { describe, it, expect, beforeEach } from "vitest";
import { useRecordsStore } from "../store/useRecordsStore";
import { WorkoutRecord } from "../types";

describe("useRecordsStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    const store = useRecordsStore.getState();
    store.setRecords([]);
    store.setLoading(false);
  });

  it("should initialize with default state", () => {
    const state = useRecordsStore.getState();
    expect(state.records).toEqual([]);
    expect(state.isLoading).toBe(false);
  });

  it("should update records and loading state", () => {
    const store = useRecordsStore.getState();
    const mockRecords: WorkoutRecord[] = [
      {
        id: "1",
        date: "2023-01-01",
        exercise: "Squat",
        weight: 100,
        reps: 5,
        unit: "kg",
      },
    ];

    store.setRecords(mockRecords);

    const state = useRecordsStore.getState();
    expect(state.records).toEqual(mockRecords);
    expect(state.isLoading).toBe(false);
  });

  describe("getPersonalBests", () => {
    it("should return empty list when no records", () => {
      const bests = useRecordsStore.getState().getPersonalBests();
      expect(bests).toEqual([]);
    });

    it("should correctly identify personal bests for different exercises", () => {
      const store = useRecordsStore.getState();
      const mockRecords: WorkoutRecord[] = [
        {
          id: "1",
          date: "2023-01-01",
          exercise: "Squat",
          weight: 100,
          reps: 5,
          unit: "kg",
        },
        {
          id: "2",
          date: "2023-01-05",
          exercise: "Squat",
          weight: 110,
          reps: 5,
          unit: "kg",
        }, // New best
        {
          id: "3",
          date: "2023-01-02",
          exercise: "Bench",
          weight: 80,
          reps: 5,
          unit: "kg",
        },
      ];

      store.setRecords(mockRecords);
      const bests = store.getPersonalBests();

      expect(bests).toHaveLength(2);
      const squatBest = bests.find((b) => b.exercise === "Squat");
      const benchBest = bests.find((b) => b.exercise === "Bench");

      expect(squatBest?.weight).toBe(110);
      expect(benchBest?.weight).toBe(80);
    });

    it("should compare 1RM for weight-based exercises", () => {
      const store = useRecordsStore.getState();
      const mockRecords: WorkoutRecord[] = [
        {
          id: "1",
          date: "2023-01-01",
          exercise: "Squat",
          weight: 100,
          reps: 10,
          unit: "kg",
        }, // 1RM ~133
        {
          id: "2",
          date: "2023-01-05",
          exercise: "Squat",
          weight: 120,
          reps: 2,
          unit: "kg",
        }, // 1RM ~128
      ];

      store.setRecords(mockRecords);
      const bests = store.getPersonalBests();

      expect(bests[0].weight).toBe(100); // 100x10 is better than 120x2 in Epley formula
      expect(bests[0].reps).toBe(10);
    });

    it("should handle time-based exercises (lower is better)", () => {
      const store = useRecordsStore.getState();
      const mockRecords: WorkoutRecord[] = [
        { id: "1", date: "2023-01-01", exercise: "Fran", time: 300 }, // 5 mins
        { id: "2", date: "2023-01-05", exercise: "Fran", time: 280 }, // 4:40 mins (new best)
      ];

      store.setRecords(mockRecords);
      const bests = store.getPersonalBests();

      expect(bests).toHaveLength(1);
      expect(bests[0].time).toBe(280);
    });

    it("should handle different weight units by converting to kg for comparison", () => {
      const store = useRecordsStore.getState();
      // 100 kg vs 210 lbs (~95 kg)
      const mockRecords: WorkoutRecord[] = [
        {
          id: "1",
          date: "2023-01-01",
          exercise: "Squat",
          weight: 100,
          reps: 1,
          unit: "kg",
        },
        {
          id: "2",
          date: "2023-01-05",
          exercise: "Squat",
          weight: 210,
          reps: 1,
          unit: "lbs",
        },
      ];

      store.setRecords(mockRecords);
      const bests = store.getPersonalBests();

      expect(bests[0].unit).toBe("kg");
      expect(bests[0].weight).toBe(100);
    });
  });
});
