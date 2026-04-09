export interface Theme {
  name: string;
  colors: {
    [key: string]: string;
  };
}

export type { 
    WorkoutRecord, 
    WorkoutRecord as HistoryRecord,
    RecordType, 
    WeightUnit 
} from '@/core/domain/models/Record';

export type { ScheduledSession } from '@/core/domain/models/Schedule';
export type { User } from '@/core/domain/models/User';
export type { ExerciseDetail } from '@/core/domain/models/Exercise';
export type { AnalysisResult, HistoricalAnalysisResult, StructuredInsight } from '@/core/domain/models/Analysis';
export type { AdminEvent } from '@/core/domain/models/AdminEvent';