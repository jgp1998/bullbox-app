import { WorkoutRecord } from '@/types';

export interface AnalysisResult {
    analysis: string;
    trainingTips: string[];
    nutritionSuggestion: string;
}

export interface ExerciseDetail {
    description: string;
    bestPractices: string[];
    commonMistakes: string[];
}

export type HistoryRecord = WorkoutRecord;
