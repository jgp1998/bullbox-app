import { create } from 'zustand';
import { HistoryRecord, ExerciseDetail, StructuredInsight } from '@/shared/types';

export type AIMode = 'cloud' | 'local';

interface AnalysisState {
    analysisResult: StructuredInsight[] | null;
    exerciseDetail: ExerciseDetail | null;
    isLoading: boolean;
    error: string | null;
    mode: AIMode;
    lastAnalyzedRecord: HistoryRecord | null;
    lastHistory: HistoryRecord[] | null;
    lastLanguage: string | undefined;
    setMode: (mode: AIMode) => void;
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
    mode: 'cloud',
    lastAnalyzedRecord: null,
    lastHistory: null,
    lastLanguage: undefined,
    
    setMode: (mode) => {
        const { lastAnalyzedRecord, lastHistory, lastLanguage } = useHistoryAnalysisStore.getState();
        set({ mode });
        
        // If we were already analyzing something, retrigger for the new mode
        if (lastAnalyzedRecord && lastHistory) {
            useHistoryAnalysisStore.getState().getAnalysis(lastAnalyzedRecord, lastHistory, lastLanguage);
        }
    },

    getAnalysis: async (record, history, language) => {
        const { mode, setMode } = useHistoryAnalysisStore.getState();
        const isOffline = typeof navigator !== 'undefined' && !navigator.onLine;
        
        // Store current record, history and language for re-triggers
        set({ lastAnalyzedRecord: record, lastHistory: history, lastLanguage: language });

        // Auto-switch to local if offline
        let targetMode = mode;
        if (isOffline && mode === 'cloud') {
            targetMode = 'local';
            setMode('local');
            return; // setMode will trigger the analysis
        }

        const repo = targetMode === 'local' 
            ? (await import('@/core/infrastructure')).webLLMAnalysisRepository 
            : (await import('@/core/infrastructure')).firebaseAnalysisRepository;

        set({ isLoading: true, error: null, analysisResult: null });
        try {
            const historyForExercise = history.filter(r => r.exercise === record.exercise);
            const result = await repo.getTrainingAdvice(record, historyForExercise, language);
            set({ analysisResult: result });
        } catch (e: any) {
            console.error("Analysis failed:", e);
            set({ error: e.message || "An unknown error occurred." });
        } finally {
            set({ isLoading: false });
        }
    },

    getExerciseDetails: async (exerciseName, language) => {
        const { mode } = useHistoryAnalysisStore.getState();
        set({ lastLanguage: language });
        const repo = mode === 'local' 
            ? (await import('@/core/infrastructure')).webLLMAnalysisRepository 
            : (await import('@/core/infrastructure')).firebaseAnalysisRepository;

        set({ isLoading: true, error: null, exerciseDetail: null });
        try {
            const result = await repo.getExerciseDetails(exerciseName, language);
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
