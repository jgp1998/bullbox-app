import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import WorkoutForm from "../components/WorkoutForm";

// Mock context/i18n
vi.mock("@/shared/context/i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

// Mock UI components
vi.mock("@/shared/components/ui/Card", () => ({
  default: ({ children, "data-testid": testId }: any) => <div data-testid={testId || "card"}>{children}</div>,
}));

vi.mock("@/shared/components/ui/Button", () => ({
  default: ({
    onClick,
    children,
    type,
    title,
    "aria-label": ariaLabel,
    "data-testid": testId,
  }: any) => (
    <button
      data-testid={testId || `button-${children || title || ariaLabel}`}
      type={type}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  ),
}));

vi.mock("@/shared/components/ui/Input", () => ({
  default: ({ label, value, onChange, type, options, id, "data-testid": testId, ...props }: any) => (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      {type === "select" ? (
        <select
          id={id}
          data-testid={testId || `input-${id}`}
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
          data-testid={testId || `input-${id}`}
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
vi.mock("@/shared/components/ui/Icons", () => ({
  PlusIcon: () => <div data-testid="plus-icon" />,
  EditIcon: () => <div data-testid="edit-icon" />,
  ChevronDownIcon: () => <div data-testid="chevron-down-icon" />,
}));

// Mock Toast
vi.mock("@/shared/context/ToastContext", () => ({
  useToast: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn(),
  }),
}));

// Mock UI Store
const mockOpenModal = vi.fn();
vi.mock("@/shared/store/useUIStore", () => ({
  useUIStore: () => ({
    openModal: mockOpenModal,
  }),
}));

// Mock Hooks
const mockExercises = ["Squat", "Bench Press"];
vi.mock("../hooks", () => ({
    useExercises: () => ({
        exercises: mockExercises,
        isLoading: false
    })
}));

describe("WorkoutForm", () => {
  const mockOnAddRecord = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the form with initial values", () => {
    render(
      <WorkoutForm
        onAddRecord={mockOnAddRecord}
      />,
    );

    expect(screen.getByLabelText("workoutForm.date")).toBeInTheDocument();
    expect(screen.getByLabelText("workoutForm.exercise")).toBeInTheDocument();
    expect(screen.getByTestId("exercise-select")).toHaveValue("Squat");
  });

  it("submits the form with weight and reps", async () => {
    render(
      <WorkoutForm
        onAddRecord={mockOnAddRecord}
      />,
    );

    fireEvent.change(screen.getByTestId("exercise-select"), {
      target: { value: "Squat" },
    });

    fireEvent.change(screen.getByTestId("weight-input"), { target: { value: "100" } });
    fireEvent.change(screen.getByTestId("reps-input"), { target: { value: "5" } });

    await act(async () => {
      fireEvent.click(screen.getByTestId("add-record-button"));
    });

    expect(mockOnAddRecord).toHaveBeenCalledWith(
      expect.objectContaining({
        exercise: "Squat",
        weight: 100,
        reps: 5,
        unit: "kg",
      }),
    );
  });

  it("submits the form with time instead of weight", async () => {
    render(
      <WorkoutForm
        onAddRecord={mockOnAddRecord}
      />,
    );

    fireEvent.change(screen.getByTestId("exercise-select"), {
      target: { value: "Bench Press" },
    });

    // Toggle advanced features to show time inputs
    fireEvent.click(screen.getByTestId("advanced-toggle"));

    const minInput = screen.getByPlaceholderText("mm");
    const secInput = screen.getByPlaceholderText("ss");

    fireEvent.change(minInput, { target: { value: "5" } });
    fireEvent.change(secInput, { target: { value: "30" } });

    await act(async () => {
      fireEvent.click(screen.getByTestId("add-record-button"));
    });

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
      />,
    );

    fireEvent.click(screen.getByTestId("add-record-button"));

    expect(
      screen.getByText("workoutForm.errors.atLeastOneMetric"),
    ).toBeInTheDocument();
    expect(mockOnAddRecord).not.toHaveBeenCalled();
  });

  it("calls openModal when clicking edit button", () => {
    render(
      <WorkoutForm
        onAddRecord={mockOnAddRecord}
      />,
    );

    const manageBtn = screen.getByTitle("workoutForm.manageExercises");
    fireEvent.click(manageBtn);

    expect(mockOpenModal).toHaveBeenCalledWith('exerciseManager');
  });
});


