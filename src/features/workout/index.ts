// Components
export { default as WorkoutForm } from './components/WorkoutForm';
export { default as ExerciseManagerModal } from './components/ExerciseManagerModal';
export { default as ExerciseDetailModal } from './components/ExerciseDetailModal';

// Shared Components (Facades)
export { WorkoutHistory } from '@/src/features/history';
export { PersonalBests } from '@/src/features/records';

// Hooks
export * from './hooks';
export { useRecords, useInitializeRecords } from '@/src/features/records';

// Stores
export * from './store/useWorkoutStore';

// Types
export * from './types';
export type { WorkoutRecord, RecordType, WeightUnit } from './types';
