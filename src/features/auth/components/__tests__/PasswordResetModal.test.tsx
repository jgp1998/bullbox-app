import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PasswordResetModal from "../PasswordResetModal";

// Mock hooks
const resetPasswordMock = vi.fn();

vi.mock("../../store/useAuthStore", () => ({
  useAuthStore: () => ({
    resetPassword: resetPasswordMock,
    isLoading: false,
  }),
}));

vi.mock("@/shared/context/i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/shared/components/ui/Icons", () => ({
  MailIcon: () => <div data-testid="mail-icon" />,
  CheckCircleIcon: () => <div data-testid="check-icon" />,
  XCircleIcon: () => <div data-testid="error-icon" />,
}));

// Mock Modal component if needed, but since it's likely a shared component 
// we should probably just let it render or mock it if it uses portals that break tests.
// Let's assume it renders its children.
vi.mock("@/shared/components/ui/Modal", () => ({
    default: ({ children, isOpen, title, onClose }: any) => isOpen ? (
        <div data-testid="modal">
            <h1>{title}</h1>
            <button onClick={onClose}>modals.close</button>
            {children}
        </div>
    ) : null
}));

describe("PasswordResetModal", () => {
  const onCloseMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders email input when open", () => {
    render(<PasswordResetModal isOpen={true} onClose={onCloseMock} />);

    expect(screen.getByLabelText("login.email")).toBeInTheDocument();
    expect(screen.getByText("modals.sendResetLink")).toBeInTheDocument();
  });

  it("calls resetPassword with correct email", async () => {
    render(<PasswordResetModal isOpen={true} onClose={onCloseMock} />);

    fireEvent.change(screen.getByLabelText("login.email"), { target: { value: "test@example.com" } });
    fireEvent.submit(screen.getByText("modals.sendResetLink").closest("form")!);

    await waitFor(() => {
      expect(resetPasswordMock).toHaveBeenCalledWith("test@example.com");
    });
  });

  it("shows success message after successful reset", async () => {
    resetPasswordMock.mockResolvedValueOnce(undefined);
    
    render(<PasswordResetModal isOpen={true} onClose={onCloseMock} />);

    fireEvent.change(screen.getByLabelText("login.email"), { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByText("modals.sendResetLink"));

    await waitFor(() => {
      expect(screen.getByText("modals.resetSubmitted")).toBeInTheDocument();
    });
    
    expect(screen.getByText("modals.checkSpam")).toBeInTheDocument();
  });

  it("shows error message when reset fails", async () => {
    resetPasswordMock.mockRejectedValueOnce({ code: "auth/user-not-found" });
    
    render(<PasswordResetModal isOpen={true} onClose={onCloseMock} />);

    fireEvent.change(screen.getByLabelText("login.email"), { target: { value: "unknown@example.com" } });
    fireEvent.click(screen.getByText("modals.sendResetLink"));

    await waitFor(() => {
      expect(screen.getByText("login.errors.userNotFound")).toBeInTheDocument();
    });
  });

  it("calls onClose when close button is clicked in success state", async () => {
    resetPasswordMock.mockResolvedValueOnce(undefined);
    
    render(<PasswordResetModal isOpen={true} onClose={onCloseMock} />);

    fireEvent.change(screen.getByLabelText("login.email"), { target: { value: "test@example.com" } });
    fireEvent.click(screen.getByText("modals.sendResetLink"));

    await waitFor(() => {
        fireEvent.click(screen.getByText("modals.close"));
    });

    expect(onCloseMock).toHaveBeenCalled();
  });
});
