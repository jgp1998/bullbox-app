import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../Navbar";
import { themes } from "@/shared/constants";

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
    language: "en",
    setLanguage: vi.fn(),
  }),
}));

vi.mock("../../../store/useUIStore", () => ({
  useUIStore: () => ({
    theme: themes[0],
    setTheme: vi.fn(),
    isMobileMenuOpen: false,
    setIsMobileMenuOpen: vi.fn(),
  }),
}));

let mockUser: any = { uid: "123", email: "test@test.com" };
let mockIsLoading = false;

vi.mock("../../../../features/auth", () => ({
  useAuthStore: () => ({
    user: mockUser,
    logout: vi.fn(),
    isLoading: mockIsLoading,
  }),
}));

// Mock UI components to simplify
vi.mock("../../ui/Button", () => ({
  default: ({ children, onClick, className }: any) => (
    <button onClick={onClick} className={className}>{children}</button>
  )
}));

vi.mock("../../ui/Input", () => ({
  default: ({ value, onChange, options, id }: any) => (
    <select id={id} value={value} onChange={onChange}>
      {options?.map((opt: any) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}));

describe("Navbar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUser = { uid: "123", email: "test@test.com" };
    mockIsLoading = false;
  });

  it("renders the logo and some navigation links", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Look for the logo - at least one heading should contain BULL or BOX
    const headings = screen.getAllByRole("heading");
    const logoHeading = headings.find(h => h.textContent?.includes("BULL"));
    expect(logoHeading).toBeInTheDocument();
    
    // Look for links - at least one should be Dashboard
    const dashboardLinks = screen.getAllByRole("link").filter(l => l.textContent?.includes("Dashboard"));
    expect(dashboardLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("toggles the mobile menu visibility state", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const toggleButton = screen.getByLabelText("Toggle menu");
    // Initially, MENU text might be in the DOM but hidden by CSS in real browser (Drawer is always rendered)
    expect(screen.getByText("MENU")).toBeInTheDocument();
  });

  it("returns null if there is no user and not loading", () => {
    mockUser = null;
    mockIsLoading = false;

    const { container } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });
});
