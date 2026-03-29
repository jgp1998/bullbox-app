import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ExerciseManagerModal from "../components/ExerciseManagerModal";

// Mock context/i18n
vi.mock("@/context/i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

// Mock UI components
vi.mock("@/components/ui/Modal", () => ({
  default: ({ children, title, isOpen, onClose }: any) =>
    isOpen ? (
      <div data-testid="modal">
        <h2>{title}</h2>
        {children}
        <button data-testid="modal-close" onClick={onClose}>
          Close
        </button>
      </div>
    ) : null,
}));

vi.mock("@/components/ui/Button", () => ({
  default: ({ onClick, children, title, "aria-label": ariaLabel }: any) => (
    <button
      data-testid={`button-${children || title || ariaLabel}`}
      onClick={onClick}
      title={title}
      aria-label={ariaLabel}
    >
      {children || title || ariaLabel}
    </button>
  ),
}));

vi.mock("@/components/ui/Input", () => ({
  default: ({ label, value, onChange, placeholder, ...props }: any) => (
    <div>
      {label && <label>{label}</label>}
      <input
        data-testid={`input-${label}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        {...props}
      />
    </div>
  ),
}));

// Mock Icons
vi.mock("@/components/Icons", () => ({
  PlusIcon: () => <div data-testid="plus-icon" />,
  TrashIcon: () => <div data-testid="trash-icon" />,
}));

describe("ExerciseManagerModal", () => {
  const mockOnAddExercise = vi.fn();
  const mockOnDeleteExercise = vi.fn();
  const mockOnClose = vi.fn();
  const mockExercises = ["Squat", "Bench Press"];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the exercise list when open", () => {
    render(
      <ExerciseManagerModal
        isOpen={true}
        onClose={mockOnClose}
        exercises={mockExercises}
        onAddExercise={mockOnAddExercise}
        onDeleteExercise={mockOnDeleteExercise}
      />,
    );

    expect(screen.getByText("Squat")).toBeInTheDocument();
    expect(screen.getByText("Bench Press")).toBeInTheDocument();
    expect(screen.getByText("modals.manageExercises")).toBeInTheDocument();
  });

  it("calls onAddExercise when adding a valid new exercise", () => {
    render(
      <ExerciseManagerModal
        isOpen={true}
        onClose={mockOnClose}
        exercises={mockExercises}
        onAddExercise={mockOnAddExercise}
        onDeleteExercise={mockOnDeleteExercise}
      />,
    );

    const input = screen.getByPlaceholderText("modals.addExercisePlaceholder");
    fireEvent.change(input, { target: { value: "Deadlift" } });

    // Button mock uses children which is the icon plus-icon div
    // I'll search for the button with aria-label
    const addButton = screen.getByLabelText("modals.addNewExercise");
    fireEvent.click(addButton);

    expect(mockOnAddExercise).toHaveBeenCalledWith("Deadlift");
    expect(input).toHaveValue("");
  });

  it("shows error if exercise name is empty", () => {
    render(
      <ExerciseManagerModal
        isOpen={true}
        onClose={mockOnClose}
        exercises={mockExercises}
        onAddExercise={mockOnAddExercise}
        onDeleteExercise={mockOnDeleteExercise}
      />,
    );

    const addButton = screen.getByLabelText("modals.addNewExercise");
    fireEvent.click(addButton);

    expect(screen.getByText("modals.errors.emptyExercise")).toBeInTheDocument();
    expect(mockOnAddExercise).not.toHaveBeenCalled();
  });

  it("shows error if exercise name already exists", () => {
    render(
      <ExerciseManagerModal
        isOpen={true}
        onClose={mockOnClose}
        exercises={mockExercises}
        onAddExercise={mockOnAddExercise}
        onDeleteExercise={mockOnDeleteExercise}
      />,
    );

    const input = screen.getByPlaceholderText("modals.addExercisePlaceholder");
    fireEvent.change(input, { target: { value: "squat" } }); // lowercase case-insensitive check

    const addButton = screen.getByLabelText("modals.addNewExercise");
    fireEvent.click(addButton);

    expect(
      screen.getByText("modals.errors.exerciseExists"),
    ).toBeInTheDocument();
    expect(mockOnAddExercise).not.toHaveBeenCalled();
  });

  it("calls onDeleteExercise when clicking trash button", () => {
    render(
      <ExerciseManagerModal
        isOpen={true}
        onClose={mockOnClose}
        exercises={mockExercises}
        onAddExercise={mockOnAddExercise}
        onDeleteExercise={mockOnDeleteExercise}
      />,
    );

    const deleteButtons = screen.getAllByTitle(/modals\.deleteExercise/);
    fireEvent.click(deleteButtons[0]);

    expect(mockOnDeleteExercise).toHaveBeenCalledWith("Squat");
  });

  it("shows empty state message when no exercises", () => {
    render(
      <ExerciseManagerModal
        isOpen={true}
        onClose={mockOnClose}
        exercises={[]}
        onAddExercise={mockOnAddExercise}
        onDeleteExercise={mockOnDeleteExercise}
      />,
    );

    expect(screen.getByText("modals.noExercises")).toBeInTheDocument();
  });
});
