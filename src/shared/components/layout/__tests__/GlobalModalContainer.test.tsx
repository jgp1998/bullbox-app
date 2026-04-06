import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import GlobalModalContainer from "../GlobalModalContainer";
import { useUIStore } from "@/shared/store/useUIStore";

// Mock the UI Store
vi.mock("@/shared/store/useUIStore", () => ({
  useUIStore: vi.fn(),
}));

// Mock feature hooks
vi.mock("@/features/workout", () => ({
  useExercises: () => ({ exercises: [], addExercise: vi.fn(), deleteExercise: vi.fn() }),
  useWorkouts: () => ({ addRecord: vi.fn() }),
  ExerciseManagerModal: ({ isOpen }: { isOpen: boolean }) => isOpen ? <div data-testid="exercise-manager">Exercise Manager</div> : null,
  ExerciseDetailModal: ({ isOpen }: { isOpen: boolean }) => isOpen ? <div data-testid="exercise-detail">Exercise Detail</div> : null,
}));

vi.mock("@/features/schedule", () => ({
  useSchedule: () => ({ addScheduledSession: vi.fn(), updateScheduledSession: vi.fn(), isLoading: false }),
  ScheduleModal: ({ isOpen }: { isOpen: boolean }) => isOpen ? <div data-testid="schedule-modal">Schedule Modal</div> : null,
}));

vi.mock("@/shared/hooks/useTrainingAnalysis", () => ({
  useTrainingAnalysis: () => ({ exerciseDetail: null, isLoading: false, error: null, getExerciseDetails: vi.fn() }),
}));

describe("GlobalModalContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when no modals are open", () => {
    vi.mocked(useUIStore).mockReturnValue({
      modals: { exerciseManager: false, exerciseDetail: false, schedule: false },
      closeModal: vi.fn(),
      editingSession: null,
      schedulingInitialDate: null,
      currentExerciseDetail: null,
    } as any);

    render(<GlobalModalContainer />);
    expect(screen.queryByTestId("exercise-manager")).not.toBeInTheDocument();
    expect(screen.queryByTestId("exercise-detail")).not.toBeInTheDocument();
    expect(screen.queryByTestId("schedule-modal")).not.toBeInTheDocument();
  });

  it("renders ExerciseManagerModal when open", () => {
    vi.mocked(useUIStore).mockReturnValue({
      modals: { exerciseManager: true, exerciseDetail: false, schedule: false },
      closeModal: vi.fn(),
    } as any);

    render(<GlobalModalContainer />);
    expect(screen.getByTestId("exercise-manager")).toBeInTheDocument();
  });
});
