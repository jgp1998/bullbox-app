import { create } from 'zustand';
import { 
    subscribeExercisesUseCase, 
    addExerciseUseCase, 
    deleteExerciseUseCase 
} from '@/core/application/use-cases/workout';
import { WorkoutState } from '../types';
import { DEFAULT_EXERCISES } from '../constants';

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
    exercises: [],
    isLoading: false,

    initialize: (uid?: string) => {
        if (!uid) return () => {};

        set({ isLoading: true });

        // Subscribe to exercises
        const unsubscribe = subscribeExercisesUseCase.execute(uid, (exercises) => {
            set({ exercises, isLoading: false });
        });

        return () => {
            unsubscribe();
        };
    },
    
    addExercise: async (exercise, uid?: string) => {
        if (!uid) return;
        await addExerciseUseCase.execute(uid, exercise);
    },

    deleteExercise: async (exerciseToDelete, uid?: string) => {
        if (!uid) return;
        await deleteExerciseUseCase.execute(uid, exerciseToDelete);
    },
}));
