import { create } from 'zustand';
import { HistoricalAnalysisResult, WorkoutRecord, User } from '@/shared/types';
import { preprocessHistory, PreprocessedData } from '../services/historyPreprocessing.service';
import { webLLMAnalysisRepository } from '@/core/infrastructure';

interface HistoricalAnalysisState {
    result: HistoricalAnalysisResult | null;
    preprocessedData: PreprocessedData | null;
    isLoading: boolean;
    error: string | null;
    runAnalysis: (records: WorkoutRecord[], language?: string, user?: User | null) => Promise<void>;
    reset: () => void;
}

export const useHistoricalAnalysisStore = create<HistoricalAnalysisState>((set) => ({
    result: null,
    preprocessedData: null,
    isLoading: false,
    error: null,

    runAnalysis: async (records, language = 'es', user = null) => {
        set({ isLoading: true, error: null });
        
        try {
            // 1. Preprocess
            const preprocessedData = preprocessHistory(records, user);
            set({ preprocessedData });
            
            // 2. Inference (Always local WebLLM)
            const result = await webLLMAnalysisRepository.getHistoricalAnalysis(preprocessedData, language);
            set({ result, isLoading: false });
        } catch (e: any) {
            console.error("Historical analysis failed:", e);
            set({ error: e.message || "Failed to generate analysis", isLoading: false });
        }
    },

    reset: () => set({ result: null, preprocessedData: null, isLoading: false, error: null })
}));
