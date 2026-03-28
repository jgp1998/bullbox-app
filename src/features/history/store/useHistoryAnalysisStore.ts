import { create } from 'zustand';
import { HistoryRecord, AnalysisResult, ExerciseDetail } from '../types';
import { getTrainingAdvice, getExerciseDetails as getDetails } from '../services';

interface AnalysisState {
    analysisResult: AnalysisResult | null;
    exerciseDetail: ExerciseDetail | null;
    isLoading: boolean;
    error: string | null;
    getAnalysis: (record: HistoryRecord, history: HistoryRecord[]) => Promise<void>;
    getExerciseDetails: (exerciseName: string) => Promise<void>;
    reset: () => void;
    setAnalysisResult: (result: AnalysisResult | null) => void;
    setExerciseDetail: (detail: ExerciseDetail | null) => void;
    setError: (error: string | null) => void;
}

export const useHistoryAnalysisStore = create<AnalysisState>((set) => ({
    analysisResult: null,
    exerciseDetail: null,
    isLoading: false,
    error: null,

    getAnalysis: async (record, history) => {
        set({ isLoading: true, error: null, analysisResult: null });
        try {
            const historyForExercise = history.filter(r => r.exercise === record.exercise);
            const result = await getTrainingAdvice(record, historyForExercise);
            set({ analysisResult: result });
        } catch (e: any) {
            set({ error: e.message || "An unknown error occurred." });
        } finally {
            set({ isLoading: false });
        }
    },

    getExerciseDetails: async (exerciseName) => {
        set({ isLoading: true, error: null, exerciseDetail: null });
        try {
            const result = await getDetails(exerciseName);
            set({ exerciseDetail: result });
        } catch (e: any) {
            set({ error: e.message || "An unknown error occurred." });
        } finally {
            set({ isLoading: false });
        }
    },

    reset: () => set({ analysisResult: null, exerciseDetail: null, isLoading: false, error: null }),
    setAnalysisResult: (result) => set({ analysisResult: result }),
    setExerciseDetail: (detail) => set({ exerciseDetail: detail }),
    setError: (error) => set({ error }),
}));
