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
  reps?: number; // Optional secondary metric
  timeValue?: number; // Optional secondary metric in seconds
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

export enum UserRole {
    Admin = 'Admin',
    Coach = 'Coach',
    Student = 'Student'
}

export interface UserPlanConfig {
    disciplines: string[]; // IDs of contracted disciplines
    daysPerWeek: number;
    totalSessionsPerMonth: number;
}

export interface User {
    id: string; // Added ID for referencing
    username: string; // This will be the name (nombre)
    rut: string;
    email: string;
    trainingCenter: string;
    phone: string;
    gender: 'Male' | 'Female' | 'Other';
    dob: string;
    password?: string; 
    role: UserRole;
    planConfig?: UserPlanConfig;
}

export interface Discipline {
    id: string;
    name: string;
    description: string;
}

export interface Coach {
    id: string;
    name: string;
    disciplines: string[]; // IDs of disciplines they teach
    email: string;
    phone: string;
}

export interface ClassSession {
    id: string;
    disciplineId: string;
    coachId: string;
    date: string; // YYYY-MM-DD
    time: string; // HH:MM
    duration: number; // in minutes
    capacity: number;
    attendees: string[]; // User IDs
}

export interface Booking {
    id: string;
    userId: string;
    classSessionId: string;
    date: string; // ISO string
    status: 'Confirmed' | 'Cancelled';
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

export type PlanFrequency = 'Daily' | 'Weekly' | 'Monthly';

export interface PlanTask {
    id: string;
    exercise: string;
    targetValue: number;
    targetType: RecordType;
    targetUnit?: WeightUnit;
    sets?: number;
    reps?: number;
    completed?: boolean;
    actualValue?: number;
    completionDate?: string;
}

export interface PlanSession {
    id: string;
    title: string;
    date?: string; // For daily plans
    dayOfWeek?: number; // 0-6 for weekly plans
    dayOfMonth?: number; // 1-31 for monthly plans
    tasks: PlanTask[];
}

export interface PlanProgressLog {
    id: string;
    date: string;
    level: string;
    metrics: string;
    note?: string;
}

export interface TrainingPlan {
    id: string;
    name: string;
    objective: string;
    frequency: PlanFrequency;
    startDate: string;
    endDate?: string;
    sessions: PlanSession[];
    isActive: boolean;
    level?: string; // Advancement level
    metrics?: string; // Measurement metrics
    progressLogs?: PlanProgressLog[];
}
