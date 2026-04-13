import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BrowserRouter } from "react-router-dom";
import PersonalBests from "../components/PersonalBests";
import { WorkoutRecord } from "@/shared/types";

// Mock I18n
vi.mock("@/shared/context/i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

// Mock UI Store
vi.mock("@/shared/store/useUIStore", () => ({
  useUIStore: () => ({
    openModal: vi.fn(),
  }),
}));

describe("PersonalBests", () => {
  const mockRecords: WorkoutRecord[] = [
    {
      id: "1",
      exercise: "Squat",
      date: "2023-01-01",
      weight: 100,
      reps: 5,
      unit: "kg",
      userId: "u1",
      type: "strength",
      volume: 500
    },
    {
      id: "2",
      exercise: "Bench Press",
      date: "2023-01-02",
      weight: 80,
      reps: 8,
      unit: "kg",
      userId: "u1",
      type: "strength",
      volume: 640
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = (props = {}) =>
    render(
      <BrowserRouter>
        <PersonalBests records={mockRecords} {...props} />
      </BrowserRouter>
    );

  it("renders the title", () => {
    renderComponent();
    expect(screen.getAllByText("personalBests.title")).toHaveLength(2); // One in Card title, one in h3
  });

  it("renders all PB records", () => {
    renderComponent();
    expect(screen.getByText("Squat")).toBeInTheDocument();
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
  });

  it("calculates and displays 1RM for weight-based records", () => {
    renderComponent();
    // 100kg for 5 reps -> 1RM approx 116.7kg (Brzycki formula: 100 / (1.0278 - 0.0278 * 5))
    // Our calculator might use a slightly different formula or rounding, but it should be around that.
    expect(screen.getByText("116.7")).toBeInTheDocument();
  });

  it("shows empty state when no records are provided", () => {
    render(
      <BrowserRouter>
        <PersonalBests records={[]} />
      </BrowserRouter>
    );
    expect(screen.getByText("personalBests.noPBs")).toBeInTheDocument();
  });

  it("shows loading skeletons when isLoading is true", () => {
    renderComponent({ isLoading: true });
    expect(screen.getAllByTestId("skeleton")).toHaveLength(4);
  });
});
