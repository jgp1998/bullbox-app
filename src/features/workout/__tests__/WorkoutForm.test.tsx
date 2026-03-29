import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import WorkoutForm from "../components/WorkoutForm";

// Mock context/i18n
vi.mock("@/context/i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

// Mock UI components
vi.mock("@/src/shared/components/ui/Card", () => ({
  default: ({ children }: any) => <div data-testid="card">{children}</div>,
}));

vi.mock("@/src/shared/components/ui/Button", () => ({
  default: ({
    onClick,
    children,
    type,
    title,
    "aria-label": ariaLabel,
  }: any) => (
    <button
      data-testid={`button-${children || title || ariaLabel}`}
      type={type}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  ),
}));

vi.mock("@/src/shared/components/ui/Input", () => ({
  default: ({ label, value, onChange, type, options, id, ...props }: any) => (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      {type === "select" ? (
        <select
          id={id}
          data-testid={`input-${id}`}
          value={value}
          onChange={onChange}
          {...props}
        >
          {options?.map((opt: any) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          data-testid={`input-${id}`}
          type={type}
          value={value || ""}
          onChange={onChange}
          {...props}
        />
      )}
    </div>
  ),
}));

// Mock Icons
vi.mock("@/src/shared/components/ui/Icons", () => ({
  PlusIcon: () => <div data-testid="plus-icon" />,
  EditIcon: () => <div data-testid="edit-icon" />,
}));

describe("WorkoutForm", () => {
  const mockOnAddRecord = vi.fn();
  const mockOnManageExercises = vi.fn();
  const mockExercises = ["Squat", "Bench Press"];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with initial values", () => {
    render(
      <WorkoutForm
        onAddRecord={mockOnAddRecord}
        onManageExercises={mockOnManageExercises}
        exercises={mockExercises}
      />,
    );

    expect(screen.getByLabelText("workoutForm.date")).toBeInTheDocument();
    expect(screen.getByLabelText("workoutForm.exercise")).toBeInTheDocument();
    expect(screen.getByTestId("input-exercise")).toHaveValue("Squat");
  });

  it("submits the form with weight and reps", () => {
    render(
      <WorkoutForm
        onAddRecord={mockOnAddRecord}
        onManageExercises={mockOnManageExercises}
        exercises={mockExercises}
      />,
    );

    fireEvent.change(screen.getByTestId("input-exercise"), {
      target: { value: "Squat" },
    });

    // Weight is nested in a div without direct id in the original component for label but my mock uses label/id
    // Actually the original uses labels as text nodes.
    const weightInput = screen.getAllByPlaceholderText("0.00")[0];
    fireEvent.change(weightInput, { target: { value: "100" } });

    const repsInput = screen.getByPlaceholderText("0");
    fireEvent.change(repsInput, { target: { value: "5" } });

    fireEvent.click(screen.getByTestId("button-workoutForm.addRecord"));

    expect(mockOnAddRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        exercise: "Squat",
        weight: 100,
        reps: 5,
        unit: "kg",
      }),
    );
  });

  it("submits the form with time instead of weight", () => {
    render(
      <WorkoutForm
        onAddRecord={mockOnAddRecord}
        onManageExercises={mockOnManageExercises}
        exercises={mockExercises}
      />,
    );

    fireEvent.change(screen.getByTestId("input-exercise"), {
      target: { value: "Bench Press" },
    });

    const minInput = screen.getByPlaceholderText("mm");
    const secInput = screen.getByPlaceholderText("ss");

    fireEvent.change(minInput, { target: { value: "5" } });
    fireEvent.change(secInput, { target: { value: "30" } });

    fireEvent.click(screen.getByTestId("button-workoutForm.addRecord"));

    expect(mockOnAddRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        exercise: "Bench Press",
        time: 330, // 5*60 + 30
      }),
    );
  });

  it("shows error if no metrics are provided", () => {
    render(
      <WorkoutForm
        onAddRecord={mockOnAddRecord}
        onManageExercises={mockOnManageExercises}
        exercises={mockExercises}
      />,
    );

    fireEvent.click(screen.getByTestId("button-workoutForm.addRecord"));

    expect(
      screen.getByText("workoutForm.errors.atLeastOneMetric"),
    ).toBeInTheDocument();
    expect(mockOnAddRecord).not.toHaveBeenCalled();
  });

  it("calls onManageExercises when clicking edit button", () => {
    render(
      <WorkoutForm
        onAddRecord={mockOnAddRecord}
        onManageExercises={mockOnManageExercises}
        exercises={mockExercises}
      />,
    );

    const manageBtn = screen.getByTitle("workoutForm.manageExercises");
    fireEvent.click(manageBtn);

    expect(mockOnManageExercises).toHaveBeenCalled();
  });
});

