import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ScheduleModal from "../components/ScheduleModal";

// Mock I18n
vi.mock("@/shared/context/i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

// Mock UI Components
vi.mock("@/shared/components/ui/Modal", () => ({
  default: ({ children, isOpen, title }: any) => (
    isOpen ? (
      <div data-testid="modal">
        <h2>{title}</h2>
        {children}
      </div>
    ) : null
  ),
}));

vi.mock("@/shared/components/ui/Alert", () => ({
  default: ({ message }: { message: string }) => <div data-testid="alert">{message}</div>,
}));

describe("ScheduleModal", () => {
  const mockOnClose = vi.fn();
  const mockOnAddSession = vi.fn();
  const mockOnUpdateSession = vi.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onAddSession: mockOnAddSession,
    onUpdateSession: mockOnUpdateSession,
    sessionToEdit: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders with default values when adding a session", () => {
    render(<ScheduleModal {...defaultProps} />);
    expect(screen.getByText("modals.scheduleSession")).toBeInTheDocument();
    expect(screen.getByTestId("schedule-title-input")).toHaveValue("");
  });

  it("populates fields when editing a session", () => {
    const sessionToEdit = {
      id: "1",
      title: "Leg Day",
      date: "2023-01-01",
      time: "10:00",
      notes: "Focus on squats",
    };
    render(<ScheduleModal {...defaultProps} sessionToEdit={sessionToEdit} />);
    
    expect(screen.getByText("modals.editSession")).toBeInTheDocument();
    expect(screen.getByTestId("schedule-title-input")).toHaveValue("Leg Day");
    expect(screen.getByTestId("schedule-notes-input")).toHaveValue("Focus on squats");
  });

  it("calls onAddSession with correct data", () => {
    render(<ScheduleModal {...defaultProps} />);
    
    fireEvent.change(screen.getByTestId("schedule-title-input"), { target: { value: "Chest Day" } });
    fireEvent.change(screen.getByTestId("schedule-date-input"), { target: { value: "2023-02-01" } });
    fireEvent.change(screen.getByTestId("schedule-time-input"), { target: { value: "18:00" } });
    
    fireEvent.click(screen.getByTestId("schedule-submit-button"));
    
    expect(mockOnAddSession).toHaveBeenCalledWith({
      title: "Chest Day",
      date: "2023-02-01",
      time: "18:00",
      notes: "",
    });
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("shows error if required fields are missing", () => {
    render(<ScheduleModal {...defaultProps} />);
    
    fireEvent.submit(screen.getByTestId("schedule-submit-button").closest("form")!);
    
    expect(screen.getByTestId("alert")).toHaveTextContent("modals.errors.allFieldsRequired");
    expect(mockOnAddSession).not.toHaveBeenCalled();
  });
});
