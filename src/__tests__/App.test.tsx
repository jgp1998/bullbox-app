import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import App from "../App";
import { MemoryRouter } from "react-router-dom";
import { useAuthStore } from "@/features/auth";

// Mock the Auth Store
vi.mock("@/features/auth", () => ({
  useAuthStore: vi.fn(),
  LoginScreen: () => <div data-testid="login-screen">Login Screen</div>,
}));

// Mock MainLayout to simplify routing tests
vi.mock("@/shared/components/layout/MainLayout", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>,
}));

// Mock AppInitializer
vi.mock("@/shared/components/AppInitializer", () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="app-initializer">{children}</div>,
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

  it("renders MainLayout and AppInitializer when user is authenticated", async () => {
    vi.mocked(useAuthStore).mockReturnValue({
      user: { uid: "123" },
      isLoading: false,
    } as any);

    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId("app-initializer")).toBeInTheDocument();
    expect(screen.getByTestId("main-layout")).toBeInTheDocument();
  });
});
