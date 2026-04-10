import { create } from 'zustand';
import { HistoryRecord, ExerciseDetail, StructuredInsight } from '@/shared/types';
import { webLLMAnalysisRepository } from '@/core/infrastructure';

interface AnalysisState {
    analysisResult: StructuredInsight[] | null;
    exerciseDetail: ExerciseDetail | null;
    isLoading: boolean;
    error: string | null;
    lastAnalyzedRecord: HistoryRecord | null;
    lastHistory: HistoryRecord[] | null;
    lastLanguage: string | undefined;
    getAnalysis: (record: HistoryRecord, history: HistoryRecord[], language?: string) => Promise<void>;
    getExerciseDetails: (exerciseName: string, language?: string) => Promise<void>;
    reset: () => void;
    setAnalysisResult: (result: StructuredInsight[] | null) => void;
    setExerciseDetail: (detail: ExerciseDetail | null) => void;
    setError: (error: string | null) => void;
}

export const useHistoryAnalysisStore = create<AnalysisState>((set) => ({
    analysisResult: null,
    exerciseDetail: null,
    isLoading: false,
    error: null,
    lastAnalyzedRecord: null,
    lastHistory: null,
    lastLanguage: undefined,
    
    getAnalysis: async (record, history, language) => {
        // Store current record, history and language for potential re-triggers (though mode switching is gone)
        set({ lastAnalyzedRecord: record, lastHistory: history, lastLanguage: language });

        set({ isLoading: true, error: null, analysisResult: null });
        try {
            const historyForExercise = history.filter(r => r.exercise === record.exercise);
            const result = await webLLMAnalysisRepository.getTrainingAdvice(record, historyForExercise, language);
            set({ analysisResult: result });
        } catch (e: any) {
            console.error("Analysis failed:", e);
            set({ error: e.message || "An unknown error occurred." });
        } finally {
            set({ isLoading: false });
        }
    },

    getExerciseDetails: async (exerciseName, language) => {
        set({ lastLanguage: language });
        set({ isLoading: true, error: null, exerciseDetail: null });
        try {
            const result = await webLLMAnalysisRepository.getExerciseDetails(exerciseName, language);
            set({ exerciseDetail: result });
        } catch (e: any) {
            set({ error: e.message || "An unknown error occurred." });
        } finally {
            set({ isLoading: false });
        }
    },

    reset: () => set({ analysisResult: null, exerciseDetail: null, isLoading: false, error: null, lastAnalyzedRecord: null, lastHistory: null, lastLanguage: undefined }),
    setAnalysisResult: (result) => set({ analysisResult: result }),
    setExerciseDetail: (detail) => set({ exerciseDetail: detail }),
    setError: (error) => set({ error }),
}));
