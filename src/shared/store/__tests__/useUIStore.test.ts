import { describe, it, expect, beforeEach } from "vitest";
import { useUIStore } from "../useUIStore";
import { themes } from "@/shared/constants";

describe("useUIStore", () => {
  beforeEach(() => {
    // Reset store state before each test
    const { setIsMobileMenuOpen, setTheme } = useUIStore.getState();
    setIsMobileMenuOpen(false);
    setTheme(themes[0]);
  });

  it("should have correct initial state", () => {
    const state = useUIStore.getState();
    expect(state.isMobileMenuOpen).toBe(false);
    expect(state.theme).toEqual(themes[0]);
  });

  it("should toggle isMobileMenuOpen", () => {
    const { setIsMobileMenuOpen } = useUIStore.getState();
    
    setIsMobileMenuOpen(true);
    expect(useUIStore.getState().isMobileMenuOpen).toBe(true);
    
    setIsMobileMenuOpen(false);
    expect(useUIStore.getState().isMobileMenuOpen).toBe(false);
  });

  it("should update theme", () => {
    const { setTheme } = useUIStore.getState();
    const newTheme = themes[1];
    
    setTheme(newTheme);
    expect(useUIStore.getState().theme).toEqual(newTheme);
  });
});
