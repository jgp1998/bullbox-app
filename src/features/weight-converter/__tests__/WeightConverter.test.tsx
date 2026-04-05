import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import WeightConverter from "../components/WeightConverter";
import { useWeightConverter } from "../hooks/useWeightConverter";

// Mock hook
vi.mock("../hooks/useWeightConverter", () => ({
  useWeightConverter: vi.fn(),
}));

// Mock icons
vi.mock("@/shared/components/ui/Icons", () => ({
  CalculatorIcon: () => <div data-testid="calculator-icon" />,
}));

// Mock context/i18n
vi.mock("@/shared/context/i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

// Mock child component
vi.mock("@/shared/components/calculators/PlateBreakdown", () => ({
  default: ({ totalWeight }: any) => (
    <div data-testid="plate-breakdown">Breakdown for {totalWeight}</div>
  ),
}));

// Mock UI components
vi.mock("@/shared/components/ui/Card", () => ({
  default: ({ children, title }: any) => (
    <div data-testid="card">
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

vi.mock("@/shared/components/ui/Input", () => ({
  default: ({ id, label, value, onChange, "data-testid": testId }: any) => (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      <input 
        id={id}
        data-testid={testId} 
        value={value} 
        onChange={onChange} 
      />
    </div>
  ),
}));

describe("WeightConverter", () => {
  const mockUser: any = { username: "test" };

  it("renders with appropriate initial state and elements", () => {
    (useWeightConverter as any).mockReturnValue({
      kg: "",
      lbs: "",
      barWeight: "20",
      plateUnit: "kg",
      setBarWeight: vi.fn(),
      setPlateUnit: vi.fn(),
      handleKgChange: vi.fn(),
      handleLbsChange: vi.fn(),
      kgNum: NaN,
      barNum: 20,
    });

    render(<WeightConverter user={mockUser} />);

    expect(screen.getByText("weightConverter.title")).toBeInTheDocument();
    expect(
      screen.getByTestId("converter-bar-weight"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("converter-kg-input")).toBeInTheDocument();
    expect(screen.getByTestId("converter-lbs-input")).toBeInTheDocument();
  });

  it("calls handleKgChange on KG input change", () => {
    const handleKgChange = vi.fn();
    (useWeightConverter as any).mockReturnValue({
      kg: "",
      lbs: "",
      barWeight: "20",
      plateUnit: "kg",
      setBarWeight: vi.fn(),
      setPlateUnit: vi.fn(),
      handleKgChange,
      handleLbsChange: vi.fn(),
      kgNum: NaN,
      barNum: 20,
    });

    render(<WeightConverter user={mockUser} />);

    const kgInput = screen.getByTestId("converter-kg-input");
    fireEvent.change(kgInput, { target: { value: "100" } });

    expect(handleKgChange).toHaveBeenCalledWith("100");
  });

  it("shows PlateBreakdown when kgNum is valid and > 0", () => {
    (useWeightConverter as any).mockReturnValue({
      kg: "100",
      lbs: "220.46",
      barWeight: "20",
      plateUnit: "kg",
      setBarWeight: vi.fn(),
      setPlateUnit: vi.fn(),
      handleKgChange: vi.fn(),
      handleLbsChange: vi.fn(),
      kgNum: 100,
      barNum: 20,
    });

    render(<WeightConverter user={mockUser} />);

    expect(screen.getByTestId("plate-breakdown")).toBeInTheDocument();
    expect(screen.getByText("Breakdown for 100")).toBeInTheDocument();
  });
});

