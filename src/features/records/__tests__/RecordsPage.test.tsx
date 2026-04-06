import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import RecordsPage from "../RecordsPage";

vi.mock("../../workout", () => ({
  useWorkouts: () => ({
    personalBests: [],
    isLoading: false,
  }),
}));

vi.mock("../../auth", () => ({
  useAuthStore: () => ({
    user: null,
    isLoading: false,
  }),
}));

vi.mock("../../records", () => ({
  PersonalBests: () => <div data-testid="personal-bests">Personal Bests</div>,
}));

describe("RecordsPage", () => {
  it("renders correctly with title and records component", () => {
    render(<RecordsPage />);
    
    expect(screen.getByText(/Mejores Marcas Personales/i)).toBeInTheDocument();
    expect(screen.getByTestId("personal-bests")).toBeInTheDocument();
  });
});
