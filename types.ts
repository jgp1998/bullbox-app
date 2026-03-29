export interface Theme {
  name: string;
  colors: {
    [key: string]: string;
  };
}

export type { 
    WorkoutRecord, 
    RecordType, 
    WeightUnit 
} from '@/src/core/domain/models/Record';

export type { ScheduledSession } from '@/src/core/domain/models/Schedule';

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

export type { User } from '@/src/core/domain/models/User';

export interface AdminEvent {
    id: string;
    name: string;
    date: string; // ISO String
}