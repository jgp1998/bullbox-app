import { describe, it, expect, vi, beforeEach } from "vitest";
import { useWorkoutStore } from "../store/useWorkoutStore";
import { 
  subscribeExercisesUseCase, 
  addExerciseUseCase, 
  deleteExerciseUseCase 
} from "@/src/core/application/use-cases/workout";

// Mock dependencies
vi.mock("@/src/core/application/use-cases/workout", () => ({
  subscribeExercisesUseCase: { execute: vi.fn() },
  addExerciseUseCase: { execute: vi.fn() },
  deleteExerciseUseCase: { execute: vi.fn() },
}));

describe("useWorkoutStore", () => {
  const mockUid = "test-user-id";

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset state
    useWorkoutStore.setState({
      exercises: ["Squat"],
      isLoading: false,
    });
  });

  it("initializes with default state", () => {
    useWorkoutStore.setState({ exercises: ["Default"] });
    expect(useWorkoutStore.getState().exercises).toEqual(["Default"]);
    expect(useWorkoutStore.getState().isLoading).toBe(false);
  });

  describe("initialize", () => {
    it("should do nothing if no uid is provided", () => {
      const unsubscribe = useWorkoutStore.getState().initialize();

      expect(unsubscribe).toBeDefined();
      expect(subscribeExercisesUseCase.execute).not.toHaveBeenCalled();
    });

    it("should call subscribeExercisesUseCase when provided uid", () => {
      const mockUnsubscribe = vi.fn();
      (subscribeExercisesUseCase.execute as any).mockReturnValue(mockUnsubscribe);

      const unsubscribe = useWorkoutStore.getState().initialize(mockUid);

      expect(useWorkoutStore.getState().isLoading).toBe(true);
      expect(subscribeExercisesUseCase.execute).toHaveBeenCalledWith(mockUid, expect.any(Function));
      
      unsubscribe();
      expect(mockUnsubscribe).toHaveBeenCalled();
    });

    it("should update state when use case broadcasts changes", () => {
      let callback: (exercises: string[]) => void = () => {};
      (subscribeExercisesUseCase.execute as any).mockImplementation((uid: string, cb: any) => {
        callback = cb;
        return vi.fn();
      });

      useWorkoutStore.getState().initialize(mockUid);

      callback(["New Exercise"]);

      expect(useWorkoutStore.getState().exercises).toEqual(["New Exercise"]);
      expect(useWorkoutStore.getState().isLoading).toBe(false);
    });
  });

  describe("addExercise", () => {
    it("should call addExerciseUseCase with uid", async () => {
      await useWorkoutStore.getState().addExercise("Bench Press", mockUid);

      expect(addExerciseUseCase.execute).toHaveBeenCalledWith(mockUid, "Bench Press");
    });

    it("should do nothing if no uid is provided", async () => {
      await useWorkoutStore.getState().addExercise("Bench Press");
      expect(addExerciseUseCase.execute).not.toHaveBeenCalled();
    });
  });

  describe("deleteExercise", () => {
    it("should call deleteExerciseUseCase with uid", async () => {
      await useWorkoutStore.getState().deleteExercise("Squat", mockUid);

      expect(deleteExerciseUseCase.execute).toHaveBeenCalledWith(mockUid, "Squat");
    });

    it("should do nothing if no uid is provided", async () => {
      await useWorkoutStore.getState().deleteExercise("Squat");
      expect(deleteExerciseUseCase.execute).not.toHaveBeenCalled();
    });
  });
});
