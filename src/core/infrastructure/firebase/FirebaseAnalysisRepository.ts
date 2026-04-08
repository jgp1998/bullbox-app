import { httpsCallable } from "firebase/functions";
import { functions } from "@/shared/services/firebase";
import { HistoryRecord, ExerciseDetail, HistoricalAnalysisResult, StructuredInsight } from '@/shared/types';
import { AnalysisRepository } from "../../domain/repositories/AnalysisRepository";

export class FirebaseAnalysisRepository implements AnalysisRepository {
    async getTrainingAdvice(record: HistoryRecord, history: HistoryRecord[], language?: string): Promise<StructuredInsight[]> {
        try {
            const getAdvice = httpsCallable<{ record: HistoryRecord; history: HistoryRecord[]; language?: string }, StructuredInsight[]>(
                functions, 
                'getTrainingAdvice'
            );
            const result = await getAdvice({ record, history, language });
            return result.data;
        } catch (error) {
            console.error("Cloud Function 'getTrainingAdvice' failed:", error);
            throw new Error("Failed to generate advice from BullBox AI.");
        }
    }

    async getHistoricalAnalysis(data: any, language?: string): Promise<HistoricalAnalysisResult> {
        try {
            const getHistorical = httpsCallable<{ data: any; language?: string }, HistoricalAnalysisResult>(
                functions, 
                'getHistoricalAnalysis'
            );
            const result = await getHistorical({ data, language });
            return result.data;
        } catch (error) {
            console.error("Cloud Function 'getHistoricalAnalysis' failed:", error);
            throw new Error("Failed to generate historical analysis from BullBox AI.");
        }
    }

    async getExerciseDetails(exerciseName: string, language?: string): Promise<ExerciseDetail> {
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
    }
}
