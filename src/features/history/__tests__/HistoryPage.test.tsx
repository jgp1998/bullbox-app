import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HistoryPage from "../HistoryPage";

vi.mock("@/features/history", () => ({
  WorkoutHistory: () => <div data-testid="workout-history">Workout History</div>,
}));

vi.mock("@/shared/store/useUIStore", () => ({
  useUIStore: () => ({
    theme: { name: "dark", colors: {} },
  }),
}));

vi.mock("../components/AnalysisDashboard", () => ({
  default: () => <div data-testid="analysis-dashboard">Analysis Dashboard</div>,
}));

vi.mock("@/features/auth/store/useAuthStore", () => ({
  useAuthStore: () => ({
    user: null,
    isLoading: false,
    login: vi.fn(),
    logout: vi.fn(),
  }),
}));

vi.mock("../hooks/useHistory", () => ({
  useHistory: () => ({
    records: [],
    filteredRecords: [],
    exercises: [],
    uniqueExercisesWithRecords: ['All'],
    selectedExercise: 'All',
    setSelectedExercise: vi.fn(),
    analysisResult: null,
    isLoading: false,
    isRecordsLoading: false,
    error: null,
    handleGetAnalysis: vi.fn(),
    handleDeleteRecord: vi.fn(),
    handleCloseAnalysis: vi.fn()
  }),
}));

describe("HistoryPage", () => {
  it("renders correctly with title and history component", () => {
    render(<HistoryPage />);
    
    expect(screen.getByText(/Historial/i)).toBeInTheDocument();
    expect(screen.getByTestId("workout-history")).toBeInTheDocument();
  });
});
