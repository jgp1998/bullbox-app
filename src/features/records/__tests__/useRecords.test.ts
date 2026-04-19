import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useRecords, useInitializeRecords } from "../hooks/useRecords";
import { useRecordsStore } from "../store/useRecordsStore";
import { useAuthStore } from "../../auth/store/useAuthStore";
import { 
  subscribeRecordsUseCase, 
  addRecordUseCase, 
  deleteRecordUseCase 
} from "@/core/application/use-cases/records";

// Mock the dependencies
vi.mock("../store/useRecordsStore", () => ({
  useRecordsStore: vi.fn(),
}));

vi.mock("../../auth/store/useAuthStore", () => ({
  useAuthStore: vi.fn(),
}));

vi.mock("@/core/application/use-cases/records", () => ({
  subscribeRecordsUseCase: { execute: vi.fn() },
  addRecordUseCase: { execute: vi.fn() },
  deleteRecordUseCase: { execute: vi.fn() },
}));

describe("Records Hooks", () => {
  const mockSetRecords = vi.fn();
  const mockSetLoading = vi.fn();
  const mockGetPersonalBests = vi.fn();

  const mockUser = { uid: "user-123" };
  const mockRecords = [
    { id: "1", exercise: "Squat", weight: 100, reps: 5, date: "2023-01-01", userId: "user-123", boxId: "box-456" },
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

    // Mock auth store
    (useAuthStore as any).mockReturnValue({
      user: mockUser,
    });

    // Mock subscription cleanup
    (subscribeRecordsUseCase.execute as any).mockReturnValue(() => {});
    mockGetPersonalBests.mockReturnValue(mockRecords);
  });

  describe("useInitializeRecords", () => {
    it("should initialize records on mount and cleanup on unmount", () => {
      const { unmount } = renderHook(() => useInitializeRecords());

      expect(mockSetLoading).toHaveBeenCalledWith(true);
      expect(subscribeRecordsUseCase.execute).toHaveBeenCalledWith(mockUser.uid, expect.any(Function));

      unmount();
    });

    it("should handle subscription updates", () => {
      let subscriptionCallback: (records: any[]) => void = () => {};
      (subscribeRecordsUseCase.execute as any).mockImplementation((uid: string, cb: any) => {
        subscriptionCallback = cb;
        return () => {};
      });

      renderHook(() => useInitializeRecords());

      act(() => {
        subscriptionCallback([{ id: "updated", exercise: "Squat" }]);
      });

      expect(mockSetRecords).toHaveBeenCalledWith([
        { id: "updated", exercise: "Squat" },
      ]);
    });
  });

  describe("useRecords", () => {
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

    it("should call addRecordUseCase when adding a record", async () => {
      const { result } = renderHook(() => useRecords());
      const newRecord = {
        exercise: "Bench",
        weight: 80,
        reps: 5,
        date: "2023-01-02",
        userId: "user-123",
        boxId: "box-456",
      };

      await act(async () => {
        await result.current.addRecord(newRecord);
      });

      expect(addRecordUseCase.execute).toHaveBeenCalledWith(mockUser.uid, newRecord);
    });

    it("should call deleteRecordUseCase when deleting a record", async () => {
      const { result } = renderHook(() => useRecords());

      await act(async () => {
        await result.current.deleteRecord("1");
      });

      expect(deleteRecordUseCase.execute).toHaveBeenCalledWith(mockUser.uid, "1");
    });
  });
});

