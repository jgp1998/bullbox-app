export interface Theme {
  name: string;
  colors: {
    [key: string]: string;
  };
}

export type RecordType = 'Weight' | 'Reps' | 'Time';
export type WeightUnit = 'kg' | 'lbs';

export interface WorkoutRecord {
  id: string;
  date: string; // ISO string
  exercise: string;
  weight?: number;
  unit?: WeightUnit;
  reps?: number;
  time?: number; // total seconds
  barWeight?: number; // weight of the bar in kg
}

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

export type { User } from '@/src/features/auth';

export interface AdminEvent {
    id: string;
    name: string;
    date: string; // ISO String
}

export interface ScheduledSession {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    notes?: string;
}