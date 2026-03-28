import { useHistoryAnalysisStore } from '@/src/features/history/store/useHistoryAnalysisStore';

export const useTrainingAnalysis = () => {
    const { 
        analysisResult, exerciseDetail, isLoading, error, 
        getAnalysis, getExerciseDetails, setAnalysisResult, 
        setExerciseDetail, setError 
    } = useHistoryAnalysisStore();

    return {
        analysisResult,
        exerciseDetail,
        isLoading,
        error,
        getAnalysis,
        getExerciseDetails,
        setAnalysisResult,
        setExerciseDetail,
        setError
    };
};
