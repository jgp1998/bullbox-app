import { describe, it, expect, vi, beforeEach } from "vitest";
import { useHistoryAnalysisStore } from "../store/useHistoryAnalysisStore";
import { HistoryRecord } from '@/shared/types';
import { webLLMAnalysisRepository } from "@/core/infrastructure";

vi.mock("@/core/infrastructure", () => ({
  webLLMAnalysisRepository: {
    getTrainingAdvice: vi.fn(),
    getExerciseDetails: vi.fn(),
  },
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
    vi.mocked(webLLMAnalysisRepository.getTrainingAdvice).mockRejectedValueOnce(
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
      userId: 'u1',
      boxId: 'b1',
    } as HistoryRecord;

    await state.getAnalysis(dummyRecord, [dummyRecord]);

    const newState = useHistoryAnalysisStore.getState();
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe(errorMessage);
    expect(newState.analysisResult).toBeNull();
  });

  it("should set analysis result on getAnalysis success", async () => {
    const mockResult = [{
      type: "strength_progress",
      priority: "high",
      priorityScore: 0.9,
      confidence: 0.95,
      metric: {
          name: "Back Squat",
          type: "weight",
          change_percent: 12.5,
          period_weeks: 4,
          baseline_value: 100,
          current_value: 112.5,
          unit: "kg"
      },
      diagnosis: {
          trend: "strength_up"
      },
      action: {
          exercise: "Back Squat",
          type: "increase_load",
          amount: 2.5,
          unit: "kg",
          per: "workout",
          duration_weeks: 2
      }
    }];
    vi.mocked(webLLMAnalysisRepository.getTrainingAdvice).mockResolvedValueOnce(
      mockResult as any,
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
      userId: 'u1',
      boxId: 'b1',
    } as HistoryRecord;

    await state.getAnalysis(dummyRecord, [dummyRecord]);

    const newState = useHistoryAnalysisStore.getState();
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBeNull();
    expect(newState.analysisResult).toEqual(mockResult);
    expect(webLLMAnalysisRepository.getTrainingAdvice).toHaveBeenCalled();
  });

  it("should set exercise detail on getExerciseDetails success", async () => {
    const mockDetail = {
      description: "A test",
      bestPractices: ["Do this"],
      commonMistakes: ["Not this"],
    };
    vi.mocked(webLLMAnalysisRepository.getExerciseDetails).mockResolvedValueOnce(
      mockDetail,
    );

    const state = useHistoryAnalysisStore.getState();

    await state.getExerciseDetails("Squat");

    const newState = useHistoryAnalysisStore.getState();
    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBeNull();
    expect(newState.exerciseDetail).toEqual(mockDetail);
    expect(webLLMAnalysisRepository.getExerciseDetails).toHaveBeenCalledWith("Squat", undefined);
  });
});
