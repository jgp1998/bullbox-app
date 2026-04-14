import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../App";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "@/features/auth";

// Mock Firebase to avoid initialization errors
vi.mock("@/shared/services/firebase", () => ({
  auth: { onAuthStateChanged: vi.fn() },
  db: {},
  app: {},
  functions: {}
}));

// Mock AppInitializer and MainLayout
vi.mock("@/shared/components/AppInitializer", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="app-initializer">{children}</div>,
}));

vi.mock("@/shared/components/layout/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

// Mock the whole feedback feature to avoid loading deep dependencies
vi.mock("@/features/feedback", () => ({
  FeedbackPage: () => <div data-testid="feedback-page">Feedback Page</div>,
}));

// Mock Auth feature
vi.mock("@/features/auth", () => ({
  useAuthStore: vi.fn(),
  LoginScreen: () => <div data-testid="login-screen">Login Screen</div>,
}));

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders LoginScreen when user is not authenticated", async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: null,
      isLoading: false,
    } as any);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByTestId("login-screen")).toBeInTheDocument();
  });

  it("renders AppInitializer and MainLayout when authenticated", async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { uid: "123" },
      isLoading: false,
    } as any);

    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(await screen.findByTestId("app-initializer")).toBeInTheDocument();
    expect(await screen.findByTestId("main-layout")).toBeInTheDocument();
  });

  it("renders FeedbackPage when navigating to /feedback", async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { uid: "123" },
      isLoading: false,
    } as any);

    render(
      <MemoryRouter initialEntries={["/feedback"]}>
        <App />
      </MemoryRouter>
    );

    // Since we are mocking the whole feature index, we expect it to render our mock
    expect(await screen.findByTestId("feedback-page")).toBeInTheDocument();
  });
});
