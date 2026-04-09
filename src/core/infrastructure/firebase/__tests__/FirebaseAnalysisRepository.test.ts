import { describe, it, expect, vi, beforeEach } from "vitest";
import { FirebaseAnalysisRepository } from "../FirebaseAnalysisRepository";
import { httpsCallable } from "firebase/functions";

// Mock firebase/functions
vi.mock("firebase/functions", () => ({
    httpsCallable: vi.fn(),
    getFunctions: vi.fn(),
}));

// Mock the shared firebase config
vi.mock("@/shared/services/firebase", () => ({
    functions: {},
}));

describe("FirebaseAnalysisRepository", () => {
    let repository: FirebaseAnalysisRepository;
    const mockHttpsCallable = vi.mocked(httpsCallable);

    beforeEach(() => {
        repository = new FirebaseAnalysisRepository();
        vi.clearAllMocks();
    });

    it("should call getTrainingAdvice cloud function and return data", async () => {
        const mockResult = { data: { analysis: "Great", trainingTips: [], nutritionSuggestion: "" } };
        const mockFn = vi.fn().mockResolvedValue(mockResult);
        mockHttpsCallable.mockReturnValue(mockFn as any);

        const record = { id: "1", exercise: "Bench", weight: 100 } as any;
        const result = await repository.getTrainingAdvice(record, [record], "es");

        expect(mockHttpsCallable).toHaveBeenCalledWith(expect.anything(), "getTrainingAdvice");
        expect(mockFn).toHaveBeenCalledWith({ record, history: [record], language: "es" });
        expect(result).toEqual(mockResult.data);
    });

    it("should call getExerciseDetails cloud function and return data", async () => {
        const mockResult = { data: { description: "Test", bestPractices: [], commonMistakes: [] } };
        const mockFn = vi.fn().mockResolvedValue(mockResult);
        mockHttpsCallable.mockReturnValue(mockFn as any);

        const result = await repository.getExerciseDetails("Bench", "en");

        expect(mockHttpsCallable).toHaveBeenCalledWith(expect.anything(), "getExerciseDetails");
        expect(mockFn).toHaveBeenCalledWith({ exerciseName: "Bench", language: "en" });
        expect(result).toEqual(mockResult.data);
    });

    it("should throw error when cloud function fails", async () => {
        const mockFn = vi.fn().mockRejectedValue(new Error("Cloud Error"));
        mockHttpsCallable.mockReturnValue(mockFn as any);

        await expect(repository.getExerciseDetails("Bench")).rejects.toThrow("Failed to get exercise details from BullBox AI.");
    });
});
