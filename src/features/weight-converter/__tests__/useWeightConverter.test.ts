import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useWeightConverter } from "../hooks/useWeightConverter";

// Mock formatters as they might be imported from root
vi.mock("@/utils/formatters", () => ({
  kgToLbs: (kg: number) => kg * 2.20462,
  lbsToKg: (lbs: number) => lbs / 2.20462,
}));

describe("useWeightConverter", () => {
  it("should initialize with default values", () => {
    const { result } = renderHook(() => useWeightConverter());

    expect(result.current.kg).toBe("");
    expect(result.current.lbs).toBe("");
    expect(result.current.barWeight).toBe("20");
    expect(result.current.plateUnit).toBe("kg");
  });

  it("should convert KG to LBS correctly", () => {
    const { result } = renderHook(() => useWeightConverter());

    act(() => {
      result.current.handleKgChange("100");
    });

    expect(result.current.kg).toBe("100");
    expect(result.current.lbs).toBe("220.46");
  });

  it("should convert LBS to KG correctly", () => {
    const { result } = renderHook(() => useWeightConverter());

    act(() => {
      result.current.handleLbsChange("220.46");
    });

    expect(result.current.lbs).toBe("220.46");
    expect(result.current.kg).toBe("100.00");
  });

  it("should clear values when input is empty", () => {
    const { result } = renderHook(() => useWeightConverter());

    act(() => {
      result.current.handleKgChange("100");
    });
    expect(result.current.lbs).not.toBe("");

    act(() => {
      result.current.handleKgChange("");
    });
    expect(result.current.kg).toBe("");
    expect(result.current.lbs).toBe("");
  });

  it("should update barWeight", () => {
    const { result } = renderHook(() => useWeightConverter());

    act(() => {
      result.current.setBarWeight("15");
    });

    expect(result.current.barWeight).toBe("15");
    expect(result.current.barNum).toBe(15);
  });

  it("should update plateUnit", () => {
    const { result } = renderHook(() => useWeightConverter());

    act(() => {
      result.current.setPlateUnit("lbs");
    });

    expect(result.current.plateUnit).toBe("lbs");
  });
});
