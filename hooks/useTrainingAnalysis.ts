import { useAnalysisStore } from '../store/useAnalysisStore';

export const useTrainingAnalysis = () => {
    const { 
        analysisResult, exerciseDetail, isLoading, error, 
        getAnalysis, getExerciseDetails, setAnalysisResult, 
        setExerciseDetail, setError 
    } = useAnalysisStore();

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
