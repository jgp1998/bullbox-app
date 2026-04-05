import { useEffect } from 'react';
import { useRecords } from '@/features/records';
import { useWorkoutStore } from '../store/useWorkoutStore';
import { useAuthStore } from '../../auth/store/useAuthStore';

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
    const { user } = useAuthStore();
    const { exercises, addExercise, deleteExercise, isLoading, initialize } = useWorkoutStore();

    useEffect(() => {
        if (user) {
            const unsubscribe = initialize(user.uid);
            return () => unsubscribe();
        }
    }, [user, initialize]);

    const handleAddExercise = (exercise: string) => addExercise(exercise, user?.uid);
    const handleDeleteExercise = (exercise: string) => deleteExercise(exercise, user?.uid);

    return { 
        exercises, 
        addExercise: handleAddExercise, 
        deleteExercise: handleDeleteExercise, 
        isLoading 
    };
};
