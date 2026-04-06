import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import HistoryPage from "../HistoryPage";

vi.mock("../../history", () => ({
  WorkoutHistory: () => <div data-testid="workout-history">Workout History</div>,
}));

vi.mock("../../../shared/store/useUIStore", () => ({
  useUIStore: () => ({
    theme: { name: "dark", colors: {} },
  }),
}));

describe("HistoryPage", () => {
  it("renders correctly with title and history component", () => {
    render(<HistoryPage />);
    
    expect(screen.getByText(/Historial de Entrenamientos/i)).toBeInTheDocument();
    expect(screen.getByTestId("workout-history")).toBeInTheDocument();
  });
});
