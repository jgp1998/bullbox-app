import { describe, it, expect, vi, beforeEach } from "vitest";
import { WebLLMAnalysisRepository } from "../WebLLMAnalysisRepository";
import { CreateWebWorkerMLCEngine } from "@mlc-ai/web-llm";

// Mock @mlc-ai/web-llm
vi.mock("@mlc-ai/web-llm", () => ({
    CreateWebWorkerMLCEngine: vi.fn(),
}));

// Mock global Worker
global.Worker = class {
    onmessage = vi.fn();
    onerror = vi.fn();
    onmessageerror = vi.fn();
    postMessage = vi.fn();
    terminate = vi.fn();
    addEventListener = vi.fn();
    removeEventListener = vi.fn();
    dispatchEvent = vi.fn();
} as any;

// Mock import.meta.env
describe("WebLLMAnalysisRepository", () => {
    let repository: WebLLMAnalysisRepository;
    const mockCreateEngine = vi.mocked(CreateWebWorkerMLCEngine);

    beforeEach(() => {
        repository = new WebLLMAnalysisRepository();
        vi.clearAllMocks();
        // Reset to enabled by default for existing tests
        vi.stubEnv("VITE_ENABLE_WEBLLM", "true");
    });

    it("should throw error when WebLLM is disabled", async () => {
        vi.stubEnv("VITE_ENABLE_WEBLLM", "false");
        await expect(repository.getExerciseDetails("Squat")).rejects.toThrow("WebLLM is disabled");
    });

    it("should initialize engine only once", async () => {
        const mockEngine = {
            chat: {
                completions: {
                    create: vi.fn().mockResolvedValue({
                        choices: [{ message: { content: '{"analysis":"ok"}' } }]
                    })
                }
            }
        };
        mockCreateEngine.mockResolvedValue(mockEngine as any);

        await repository.getExerciseDetails("Squat");
        await repository.getExerciseDetails("Squat");

        expect(mockCreateEngine).toHaveBeenCalledTimes(1);
    });

    it("should format prompts correctly and parse JSON result", async () => {
        const mockInsight = {
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
        };

        const mockFn = vi.fn().mockResolvedValue({
            choices: [{ message: { content: JSON.stringify({ insights: [mockInsight] }) } }]
        });
        const mockEngine = { chat: { completions: { create: mockFn } } };
        mockCreateEngine.mockResolvedValue(mockEngine as any);

        const record = { exercise: "Squat", weight: 112.5 } as any;
        const previous = { exercise: "Squat", weight: 100 } as any;
        const result = await repository.getTrainingAdvice(record, [previous]);

        expect(result).toHaveLength(1);
        expect(result[0].type).toBe("strength_progress");
        expect(result[0].metric.change_percent).toBe(12.5);
        expect(mockFn).toHaveBeenCalled();
    });

});
