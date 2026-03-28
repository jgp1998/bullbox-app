import { useRecords } from '@/src/features/records';
import { useWorkoutStore } from '../store/useWorkoutStore';

export const useWorkouts = () => {
    const { records, addRecord, deleteRecord, personalBests, isLoading } = useRecords();
    
    return {
        records,
        addRecord,
        deleteRecord,
        personalBests,
        isLoading
    };
};

export const useExercises = () => {
    const { exercises, addExercise, deleteExercise, isLoading } = useWorkoutStore();
    return { exercises, addExercise, deleteExercise, isLoading };
};
