import { describe, it, expect, vi, beforeEach } from "vitest";
import { useHistoryAnalysisStore } from "../store/useHistoryAnalysisStore";
import * as historyService from "../services/historyAnalysis.service";
import { HistoryRecord } from '@/shared/types';

vi.mock("../services/historyAnalysis.service", () => ({
  getTrainingAdvice: vi.fn(),
  getExerciseDetails: vi.fn(),
}));

describe("useHistoryAnalysisStore", () => {
  beforeEach(() => {
    // Reset the store state before each test
    const store = useHistoryAnalysisStore.getState();
    store.reset();
    vi.clearAllMocks();
  });

  it("should initialize with default state", () => {
    const state = useHistoryAnalysisStore.getState();
    expect(state.analysisResult).toBeNull();
    expect(state.exerciseDetail).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it("should set error state on getAnalysis failure", async () => {
    const errorMessage = "API Failed";
    vi.mocked(historyService.getTrainingAdvice).mockRejectedValueOnce(
      new Error(errorMessage),
    );

    const state = useHistoryAnalysisStore.getState();
    const dummyRecord = {
      id: "1",
      date: "2023-01-01",
      exercise: "Squat",
      value: 100,
      type: "Weight",
      reps: 5,
      weight: 100,
    } as HistoryRecord;

    await state.getAnalysis(dummyRecord, [dummyRecord]);

    const newState = useHistoryAnalysisStore.getState();
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe(errorMessage);
    expect(newState.analysisResult).toBeNull();
  });

  it("should set analysis result on getAnalysis success", async () => {
    const mockResult = {
      analysis: "Good",
      trainingTips: ["Tip 1"],
      nutritionSuggestion: "Eat",
    };
    vi.mocked(historyService.getTrainingAdvice).mockResolvedValueOnce(
      mockResult,
    );

    const state = useHistoryAnalysisStore.getState();
    const dummyRecord = {
      id: "1",
      date: "2023-01-01",
      exercise: "Squat",
      value: 100,
      type: "Weight",
      reps: 5,
      weight: 100,
    } as HistoryRecord;

    await state.getAnalysis(dummyRecord, [dummyRecord]);

    const newState = useHistoryAnalysisStore.getState();
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBeNull();
    expect(newState.analysisResult).toEqual(mockResult);
  });

  it("should set exercise detail on getExerciseDetails success", async () => {
    const mockDetail = {
      description: "A test",
      bestPractices: ["Do this"],
      commonMistakes: ["Not this"],
    };
    vi.mocked(historyService.getExerciseDetails).mockResolvedValueOnce(
      mockDetail,
    );

    const state = useHistoryAnalysisStore.getState();

    await state.getExerciseDetails("Squat");

    const newState = useHistoryAnalysisStore.getState();
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBeNull();
    expect(newState.exerciseDetail).toEqual(mockDetail);
  });
});
