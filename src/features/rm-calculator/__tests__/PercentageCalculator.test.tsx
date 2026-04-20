import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import type { WorkoutRecord } from "@/shared/types";
import type { User } from '@/core/domain/models/User';
import PercentageCalculator from "../components/PercentageCalculator";

// Mock context/i18n
vi.mock("@/shared/context/i18n", () => ({
  useI18n: () => ({
    t: (key: string, params?: any) => {
      if (key === "percentageCalculator.basedOn") {
        return `Based on ${params.value} ${params.unit} for ${params.exercise}`;
      }
      return key;
    },
  }),
}));

// Mock icons
vi.mock("@/shared/components/ui/Icons", () => ({
  CalculatorIcon: () => <div data-testid="calculator-icon" />,
}));

// Mock child component
vi.mock("@/shared/components/calculators/PlateBreakdown", () => ({
  default: ({ totalWeight }: any) => (
    <div data-testid="plate-breakdown">
      Breakdown for {totalWeight.toFixed(1)}
    </div>
  ),
}));

// Mock UI components
vi.mock("@/shared/components/ui/Card", () => ({
  default: ({ children, title, icon }: any) => (
    <div data-testid="card">
      {icon}
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

vi.mock("@/shared/components/ui/Input", () => ({
  default: ({ id, label, value, onChange, options, type, required, "data-testid": testId }: any) => (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      {type === "select" ? (
        <select
          id={id}
          data-testid={testId}
          value={value}
          onChange={onChange}
          required={required}
        >
          {(options || []).map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          data-testid={testId}
          value={value || ""}
          onChange={onChange}
          required={required}
        />
      )}
    </div>
  ),
}));

vi.mock("@/shared/components/ui/Button", () => ({
  default: ({ children, disabled, type }: any) => (
    <button disabled={disabled} type={type}>
      {children}
    </button>
  ),
}));

describe("PercentageCalculator", () => {
  const mockUser: User = {
    uid: "test-uid",
    username: "test",
    gender: "Male",
    email: "test@test.com",
    dob: "1990-01-01",
    role: "athlete",
  };

  const mockRecords: WorkoutRecord[] = [
    {
      id: "1",
      date: "2024-03-28",
      exercise: "Squat",
      weight: 100,
      unit: "kg",
      reps: 5,
      userId: "test-uid",
      boxId: "test-box",
    },
    {
      id: "2",
      date: "2024-03-27",
      exercise: "Bench Press",
      weight: 80,
      unit: "kg",
      reps: 1,
      userId: "test-uid",
      boxId: "test-box",
    },
  ];

  it("renders and selects the first exercise by default", () => {
    render(<PercentageCalculator records={mockRecords} user={mockUser} />);

    expect(screen.getByText("percentageCalculator.title")).toBeInTheDocument();
    const select = screen.getByTestId(
      "percentage-exercise-select",
    ) as HTMLSelectElement;
    expect(select.value).toBe("Squat");
  });

  it("calculates the correct percentage of 1RM", () => {
    render(<PercentageCalculator records={mockRecords} user={mockUser} />);

    // 100kg x 5 reps = 116.7kg (Epley)
    // 80% of 116.7kg = 93.3kg

    const percInput = screen.getByTestId(
      "percentage-input",
    );
    fireEvent.change(percInput, { target: { value: "80" } });

    const calcButton = screen.getByRole("button", {
      name: "percentageCalculator.calculate",
    });
    fireEvent.click(calcButton);

    expect(screen.getByText("Based on 116.7 kg for Squat")).toBeInTheDocument();
    expect(screen.getByText("93.3")).toBeInTheDocument(); // kg value
    expect(screen.getByText("205.8")).toBeInTheDocument(); // lbs value
    expect(screen.getByTestId("plate-breakdown")).toHaveTextContent(
      "Breakdown for 93.3",
    );
  });

  it("updates results when calculation is rerun with different percentage", () => {
    render(<PercentageCalculator records={mockRecords} user={mockUser} />);

    const percInput = screen.getByTestId(
      "percentage-input",
    );
    fireEvent.change(percInput, { target: { value: "90" } });
    fireEvent.click(
      screen.getByRole("button", { name: "percentageCalculator.calculate" }),
    );

    // 90% of 116.7kg = 105.0kg
    expect(screen.getByText("105.0")).toBeInTheDocument();
  });

  it("shows message when no PBs are available", () => {
    render(<PercentageCalculator records={[]} user={mockUser} />);

    expect(screen.getByText("percentageCalculator.noPBs")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "percentageCalculator.calculate" }),
    ).toBeDisabled();
  });
});

