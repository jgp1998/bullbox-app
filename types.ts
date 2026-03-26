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
  type: RecordType;
  value: number;
  unit?: WeightUnit;
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

export interface User {
    username: string;
    gender: 'Male' | 'Female' | 'Other';
    email: string;
    dob: string;
    password?: string; 
}

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

export interface Plate {
  weight: number;
  color: string;
}