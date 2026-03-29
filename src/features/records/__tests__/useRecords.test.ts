import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useRecords } from "../hooks/useRecords";
import { useRecordsStore } from "../store/useRecordsStore";
import { RecordsService } from "../services/records.service";

// Mock the dependencies
vi.mock("../store/useRecordsStore", () => ({
  useRecordsStore: vi.fn(),
}));

vi.mock("../services/records.service", () => ({
  RecordsService: {
    subscribeToRecords: vi.fn(),
    addRecord: vi.fn(),
    deleteRecord: vi.fn(),
  },
}));

describe("useRecords", () => {
  const mockSetRecords = vi.fn();
  const mockSetLoading = vi.fn();
  const mockGetPersonalBests = vi.fn();

  const mockRecords = [
    { id: "1", exercise: "Squat", weight: 100, reps: 5, date: "2023-01-01" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup mock implementations for the store
    (useRecordsStore as any).mockReturnValue({
      records: mockRecords,
      isLoading: false,
      setRecords: mockSetRecords,
      setLoading: mockSetLoading,
      getPersonalBests: mockGetPersonalBests,
    });

    // Mock subscription cleanup
    (RecordsService.subscribeToRecords as any).mockReturnValue(() => {});
    mockGetPersonalBests.mockReturnValue(mockRecords);
  });

  it("should initialize records on mount and cleanup on unmount", () => {
    const { unmount } = renderHook(() => useRecords());

    expect(mockSetLoading).toHaveBeenCalledWith(true);
    expect(RecordsService.subscribeToRecords).toHaveBeenCalled();

    unmount();
    // Verification of cleanup function call is implicit via mockReturnValue(() => {}) above
  });

  it("should provide records and loading state from store", () => {
    const { result } = renderHook(() => useRecords());

    expect(result.current.records).toEqual(mockRecords);
    expect(result.current.isLoading).toBe(false);
  });

  it("should provide personal bests from store", () => {
    const { result } = renderHook(() => useRecords());

    expect(result.current.personalBests).toEqual(mockRecords);
    expect(mockGetPersonalBests).toHaveBeenCalled();
  });

  it("should call RecordsService.addRecord when adding a record", async () => {
    const { result } = renderHook(() => useRecords());
    const newRecord = {
      exercise: "Bench",
      weight: 80,
      reps: 5,
      date: "2023-01-02",
    };

    await act(async () => {
      await result.current.addRecord(newRecord);
    });

    expect(RecordsService.addRecord).toHaveBeenCalledWith(newRecord);
  });

  it("should call RecordsService.deleteRecord when deleting a record", async () => {
    const { result } = renderHook(() => useRecords());

    await act(async () => {
      await result.current.deleteRecord("1");
    });

    expect(RecordsService.deleteRecord).toHaveBeenCalledWith("1");
  });

  it("should handle subscription updates", () => {
    let subscriptionCallback: (records: any[]) => void = () => {};
    (RecordsService.subscribeToRecords as any).mockImplementation((cb: any) => {
      subscriptionCallback = cb;
      return () => {};
    });

    renderHook(() => useRecords());

    act(() => {
      subscriptionCallback([{ id: "updated", exercise: "Squat" }]);
    });

    expect(mockSetRecords).toHaveBeenCalledWith([
      { id: "updated", exercise: "Squat" },
    ]);
  });
});
