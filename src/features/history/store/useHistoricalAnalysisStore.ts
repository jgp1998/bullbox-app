import { create } from 'zustand';
import { HistoricalAnalysisResult, WorkoutRecord, User } from '@/shared/types';
import { preprocessHistory, PreprocessedData } from '../services/historyPreprocessing.service';
import { useAIStore } from '@/features/ai/store/useAIStore';

interface HistoricalAnalysisState {
    result: HistoricalAnalysisResult | null;
    preprocessedData: PreprocessedData | null;
    isLoading: boolean;
    error: string | null;
    runAnalysis: (records: WorkoutRecord[], mode: 'cloud' | 'local', language?: string, user?: User | null) => Promise<void>;
    reset: () => void;
}

export const useHistoricalAnalysisStore = create<HistoricalAnalysisState>((set) => ({
    result: null,
    preprocessedData: null,
    isLoading: false,
    error: null,

    runAnalysis: async (records, mode, language = 'es', user = null) => {
        set({ isLoading: true, error: null });
        
        try {
            // 1. Preprocess
            const preprocessedData = preprocessHistory(records, user);
            set({ preprocessedData });
            
            // 2. Get Repository
            const repo = mode === 'local' 
                ? (await import('@/core/infrastructure')).webLLMAnalysisRepository 
                : (await import('@/core/infrastructure')).firebaseAnalysisRepository;

            // 3. Inference
            const result = await repo.getHistoricalAnalysis(preprocessedData, language);
            set({ result, isLoading: false });
        } catch (e: any) {
            console.error("Historical analysis failed:", e);
            set({ error: e.message || "Failed to generate analysis", isLoading: false });
        }
    },

    reset: () => set({ result: null, preprocessedData: null, isLoading: false, error: null })
}));
