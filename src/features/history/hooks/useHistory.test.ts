import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useHistory } from './useHistory';
import { useHistoryAnalysisStore } from '../store/useHistoryAnalysisStore';
import { useWorkoutStore } from '@/store/useWorkoutStore';

// Mock the stores
vi.mock('../store/useHistoryAnalysisStore', () => ({
    useHistoryAnalysisStore: vi.fn()
}));

vi.mock('@/store/useWorkoutStore', () => ({
    useWorkoutStore: vi.fn()
}));

describe('useHistory', () => {
    const mockDeleteRecord = vi.fn();
    const mockGetAnalysis = vi.fn();
    const mockReset = vi.fn();

    const mockRecords = [
        { id: '1', exercise: 'Squat', value: 100, date: '2023-01-01' },
        { id: '2', exercise: 'Squat', value: 110, date: '2023-01-02' },
        { id: '3', exercise: 'Bench Press', value: 80, date: '2023-01-03' }
    ];

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup mock implementations
        (useWorkoutStore as any).mockReturnValue({
            records: mockRecords,
            deleteRecord: mockDeleteRecord
        });

        (useHistoryAnalysisStore as any).mockReturnValue({
            analysisResult: null,
            isLoading: false,
            error: null,
            getAnalysis: mockGetAnalysis,
            reset: mockReset
        });
    });

    it('should initialize with derived data from store records', () => {
        const { result } = renderHook(() => useHistory());

        expect(result.current.records).toEqual(mockRecords);
        expect(result.current.exercises).toEqual(['Squat', 'Bench Press']);
        expect(result.current.uniqueExercisesWithRecords).toEqual(['All', 'Squat', 'Bench Press']);
        expect(result.current.selectedExercise).toBe('All');
        expect(result.current.filteredRecords).toEqual(mockRecords);
    });

    it('should filter records when an exercise is selected', () => {
        const { result } = renderHook(() => useHistory());

        act(() => {
            result.current.setSelectedExercise('Squat');
        });

        expect(result.current.selectedExercise).toBe('Squat');
        expect(result.current.filteredRecords).toEqual([
            mockRecords[0],
            mockRecords[1]
        ]);
    });

    it('should call getAnalysis properly', async () => {
        const { result } = renderHook(() => useHistory());

        await act(async () => {
            await result.current.handleGetAnalysis(mockRecords[0] as any);
        });

        expect(mockGetAnalysis).toHaveBeenCalledWith(mockRecords[0], mockRecords);
    });

    it('should call deleteRecord properly', () => {
        const { result } = renderHook(() => useHistory());

        act(() => {
            result.current.handleDeleteRecord('1');
        });

        expect(mockDeleteRecord).toHaveBeenCalledWith('1');
    });

    it('should call reset when closing analysis', () => {
        const { result } = renderHook(() => useHistory());

        act(() => {
            result.current.handleCloseAnalysis();
        });

        expect(mockReset).toHaveBeenCalled();
    });
});
