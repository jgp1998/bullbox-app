import { HistoryRecord, ExerciseDetail, HistoricalAnalysisResult, StructuredInsight } from '@/shared/types';

export interface AnalysisRepository {
    getTrainingAdvice(record: HistoryRecord, history: HistoryRecord[], language?: string): Promise<StructuredInsight[]>;
    getHistoricalAnalysis(data: any, language?: string): Promise<HistoricalAnalysisResult>;
    getExerciseDetails(exerciseName: string, language?: string): Promise<ExerciseDetail>;
}
