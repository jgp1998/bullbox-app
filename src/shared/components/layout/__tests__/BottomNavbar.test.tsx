import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import BottomNavbar from "../BottomNavbar";

// Mock hooks
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useLocation: () => ({ pathname: "/" }),
  };
});

vi.mock("../../../context/i18n", () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("../../../store/useUIStore", () => ({
  useUIStore: () => ({
    isMobileMenuOpen: false,
    setIsMobileMenuOpen: vi.fn(),
  }),
}));

vi.mock("../../../../features/auth", () => ({
  useAuthStore: () => ({
    user: { uid: "123", email: "test@test.com" },
  }),
}));

describe("BottomNavbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with main links", () => {
    render(
      <MemoryRouter>
        <BottomNavbar />
      </MemoryRouter>
    );

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("nav.train")).toBeInTheDocument();
    expect(screen.getByText("nav.history")).toBeInTheDocument();
    expect(screen.getByText("nav.records")).toBeInTheDocument();
  });

  it("contains navlinks with correct paths", () => {
    render(
      <MemoryRouter>
        <BottomNavbar />
      </MemoryRouter>
    );

    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/");
    expect(links[1]).toHaveAttribute("href", "/entrenar");
    expect(links[2]).toHaveAttribute("href", "/historial");
    expect(links[3]).toHaveAttribute("href", "/marcas");
  });

  it("has the responsive hidden class for desktop", () => {
    const { container } = render(
      <MemoryRouter>
        <BottomNavbar />
      </MemoryRouter>
    );

    const nav = container.querySelector('nav');
    expect(nav).toHaveClass("lg:hidden");
  });
});
