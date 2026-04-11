import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import MainLayout from "../MainLayout";
import { MemoryRouter } from "react-router-dom";

// Mock Navbar and BottomNavbar since they are tested separately
vi.mock("../Navbar", () => ({
  default: () => <nav data-testid="navbar">Navbar</nav>,
}));

vi.mock("../BottomNavbar", () => ({
  default: () => <nav data-testid="bottom-navbar">BottomNavbar</nav>,
}));

describe("MainLayout", () => {
  it("renders correctly with navbar and children", () => {
    const testContent = "Test Child Content";
    render(
      <MemoryRouter>
        <MainLayout>
          <div data-testid="child-content">{testContent}</div>
        </MainLayout>
      </MemoryRouter>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
    expect(screen.getByTestId("bottom-navbar")).toBeInTheDocument();
    expect(screen.getByTestId("child-content")).toHaveTextContent(testContent);
  });

  it("has correct layout classes", () => {
    const { container } = render(
      <MemoryRouter>
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      </MemoryRouter>
    );

    const layoutDiv = container.firstChild as HTMLElement;
    expect(layoutDiv).toHaveClass("min-h-screen");
    expect(layoutDiv.querySelector('main')).toHaveClass("max-w-7xl");
    expect(layoutDiv.querySelector('main')).toHaveClass("pb-20");
  });
});
