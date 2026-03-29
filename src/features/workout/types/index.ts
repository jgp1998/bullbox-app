export type { 
    WorkoutRecord, 
    RecordType, 
    WeightUnit 
} from '@/src/core/domain/models/Record';

export interface WorkoutState {
    exercises: string[];
    isLoading: boolean;
    initialize: (uid?: string) => () => void;
    addExercise: (exercise: string, uid?: string) => Promise<void>;
    deleteExercise: (exercise: string, uid?: string) => Promise<void>;
}
