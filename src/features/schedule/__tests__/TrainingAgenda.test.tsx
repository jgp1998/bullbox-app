import { render, screen, fireEvent, within } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TrainingAgenda from "../components/TrainingAgenda";

// Mock I18n
vi.mock("@/shared/context/i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
    language: "es",
  }),
}));

// Mock UI Store
const mockOpenModal = vi.fn();
vi.mock("@/shared/store/useUIStore", () => ({
  useUIStore: () => ({
    openModal: mockOpenModal,
  }),
}));

describe("TrainingAgenda", () => {
  const fixedDate = new Date("2024-03-20T12:00:00Z"); // A Wednesday

  beforeEach(() => {
    vi.clearAllMocks();
    vi.setSystemTime(fixedDate);
  });

  const mockSessions = [
    {
      id: "1",
      title: "Leg Workout",
      date: "2024-03-20", // Today
      time: "10:00",
      notes: "Heavy squats",
    },
    {
      id: "2",
      title: "Chest Day",
      date: "2024-03-21", // Tomorrow (Thursday)
      time: "11:00",
    },
  ];

  const mockOnDeleteSession = vi.fn();

  it("renders the agenda title", () => {
    render(<TrainingAgenda sessions={mockSessions} onDeleteSession={mockOnDeleteSession} />);
    expect(screen.getByTestId("agenda-title")).toHaveTextContent("trainingSchedule.title");
  });

  it("renders scheduled sessions", () => {
    render(<TrainingAgenda sessions={mockSessions} onDeleteSession={mockOnDeleteSession} />);
    expect(screen.getByText("Leg Workout")).toBeInTheDocument();
    expect(screen.getByText("Chest Day")).toBeInTheDocument();
  });

  it("calls openModal when clicking on a day", () => {
    render(<TrainingAgenda sessions={mockSessions} onDeleteSession={mockOnDeleteSession} />);
    // Select the day "20" which is today in our fixed date
    const dayElement = screen.getByText("20").closest('div');
    fireEvent.click(dayElement!);
    expect(mockOpenModal).toHaveBeenCalledWith("schedule", "2024-03-20");
  });

  it("calls openModal when clicking add button", () => {
    render(<TrainingAgenda sessions={mockSessions} onDeleteSession={mockOnDeleteSession} />);
    fireEvent.click(screen.getByTestId("schedule-add-button"));
    expect(mockOpenModal).toHaveBeenCalledWith("schedule");
  });

  it("shows empty message when no sessions are present", () => {
    render(<TrainingAgenda sessions={[]} onDeleteSession={mockOnDeleteSession} />);
    expect(screen.getByTestId("no-sessions-message")).toBeInTheDocument();
  });

  it("calls onDeleteSession when clicking delete button and confirming via modal", async () => {
    render(<TrainingAgenda sessions={mockSessions} onDeleteSession={mockOnDeleteSession} />);
    
    const sessionCards = screen.getAllByTestId("session-card");
    const deleteButton = within(sessionCards[0]).getAllByRole("button")[1];
    fireEvent.click(deleteButton);
    
    // Check if ConfirmModal is visible
    expect(await screen.findByText("modals.confirmDeleteTitle")).toBeInTheDocument();
    
    // Click confirm in modal
    const confirmButton = screen.getByText("common.confirm");
    fireEvent.click(confirmButton);
    
    expect(mockOnDeleteSession).toHaveBeenCalledWith("1");
  });
});
