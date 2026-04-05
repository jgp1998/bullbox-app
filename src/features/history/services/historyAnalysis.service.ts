import { httpsCallable } from "firebase/functions";
import { functions } from "@/shared/services/firebase";
import { HistoryRecord, AnalysisResult, ExerciseDetail } from '@/shared/types';

/**
 * Gets training advice for a specific record based on history.
 * Now calls a secure Firebase Cloud Function instead of direct Gemini API.
 */
export const getTrainingAdvice = async (record: HistoryRecord, history: HistoryRecord[], language?: string): Promise<AnalysisResult> => {
    try {
        const getAdvice = httpsCallable<{ record: HistoryRecord; history: HistoryRecord[]; language?: string }, AnalysisResult>(
            functions, 
            'getTrainingAdvice'
        );
        const result = await getAdvice({ record, history, language });
        return result.data;
    } catch (error) {
        console.error("Cloud Function 'getTrainingAdvice' failed:", error);
        throw new Error("Failed to generate advice from BullBox AI.");
    }
};

/**
 * Gets detailed information about an exercise.
 * Now calls a secure Firebase Cloud Function instead of direct Gemini API.
 */
export const getExerciseDetails = async (exerciseName: string, language?: string): Promise<ExerciseDetail> => {
    try {
        const getDetails = httpsCallable<{ exerciseName: string; language?: string }, ExerciseDetail>(
            functions, 
            'getExerciseDetails'
        );
        const result = await getDetails({ exerciseName, language });
        return result.data;
    } catch (error) {
        console.error("Cloud Function 'getExerciseDetails' failed:", error);
        throw new Error("Failed to get exercise details from BullBox AI.");
    }
};
