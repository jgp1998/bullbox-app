import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import LoginScreen from "../LoginScreen";

// Mock hooks
const loginMock = vi.fn();
const registerMock = vi.fn();

vi.mock("../../store/useAuthStore", () => ({
  useAuthStore: () => ({
    login: loginMock,
    register: registerMock,
    isLoading: false,
  }),
}));

vi.mock("@/shared/context/i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/shared/components/ui/Icons", () => ({
  BullboxLogo: () => <div data-testid="bullbox-logo" />,
  MailIcon: () => <div data-testid="mail-icon" />,
  CheckCircleIcon: () => <div data-testid="check-icon" />,
  XCircleIcon: () => <div data-testid="error-icon" />,
}));

vi.mock("../PasswordResetModal", () => ({
  default: ({ isOpen }: any) => isOpen ? <div data-testid="password-reset-modal" /> : null,
}));

describe("LoginScreen", () => {
  const onLoginMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form by default", () => {
    render(<LoginScreen onLogin={onLoginMock} />);

    expect(screen.getByTestId("login-username")).toBeInTheDocument();
    expect(screen.getByTestId("login-password")).toBeInTheDocument();
    expect(screen.getByTestId("login-submit")).toHaveTextContent("login.loginButton");
  });

  it("toggles between login and register modes", () => {
    render(<LoginScreen onLogin={onLoginMock} />);

    const toggleButton = screen.getByText("login.switchToRegister");
    fireEvent.click(toggleButton);

    expect(screen.getByLabelText("login.username")).toBeInTheDocument();
    expect(screen.getByLabelText("login.email")).toBeInTheDocument();
    expect(screen.getByLabelText("login.dob")).toBeInTheDocument();
    expect(screen.getByText("login.registerButton")).toBeInTheDocument();

    const backToLoginButton = screen.getByText("login.switchToLogin");
    fireEvent.click(backToLoginButton);
    expect(screen.getByTestId("login-submit")).toBeInTheDocument();
  });

  it("calls login with correct credentials", async () => {
    render(<LoginScreen onLogin={onLoginMock} />);

    fireEvent.change(screen.getByTestId("login-username"), { target: { value: "testuser" } });
    fireEvent.change(screen.getByTestId("login-password"), { target: { value: "password123" } });
    
    const submitButton = screen.getByTestId("login-submit");
    fireEvent.submit(screen.getByTestId("login-username").closest("form")!);

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith("testuser", "password123");
    });
  });

  it("shows error message when login fails", async () => {
    loginMock.mockRejectedValueOnce({ code: "auth/invalid-credential" });
    
    render(<LoginScreen onLogin={onLoginMock} />);

    fireEvent.change(screen.getByTestId("login-username"), { target: { value: "wronguser" } });
    fireEvent.change(screen.getByTestId("login-password"), { target: { value: "wrongpass" } });
    
    fireEvent.click(screen.getByTestId("login-submit"));

    await waitFor(() => {
      expect(screen.getByTestId("login-error")).toHaveTextContent("login.errors.invalidCredentials");
    });
  });

  it("calls register with correct user data", async () => {
    render(<LoginScreen onLogin={onLoginMock} />);

    fireEvent.click(screen.getByText("login.switchToRegister"));

    fireEvent.change(screen.getByLabelText("login.username"), { target: { value: "newuser" } });
    fireEvent.change(screen.getByLabelText("login.email"), { target: { value: "new@example.com" } });
    fireEvent.change(screen.getByLabelText("login.dob"), { target: { value: "1990-01-01" } });
    fireEvent.change(screen.getByLabelText("login.password"), { target: { value: "Password123!" } });
    fireEvent.change(screen.getByLabelText("login.confirmPassword"), { target: { value: "Password123!" } });
    
    fireEvent.click(screen.getByText("login.registerButton"));

    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        username: "newuser",
        email: "new@example.com",
        dob: "1990-01-01",
        gender: "Male",
        password: "Password123!"
      });
    });
  });

  it("shows password mismatch error during registration", async () => {
    render(<LoginScreen onLogin={onLoginMock} />);

    fireEvent.click(screen.getByText("login.switchToRegister"));

    fireEvent.change(screen.getByLabelText("login.username"), { target: { value: "testuser" } });
    fireEvent.change(screen.getByLabelText("login.email"), { target: { value: "test@example.com" } });
    fireEvent.change(screen.getByLabelText("login.dob"), { target: { value: "2000-01-01" } });
    fireEvent.change(screen.getByLabelText("login.password"), { target: { value: "pass1" } });
    fireEvent.change(screen.getByLabelText("login.confirmPassword"), { target: { value: "pass2" } });
    
    fireEvent.click(screen.getByText("login.registerButton"));

    await waitFor(() => {
      expect(screen.getByTestId("login-error")).toHaveTextContent("login.errors.passwordMismatch");
    });
  });
});
