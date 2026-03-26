import { useWorkoutStore } from '../store/useWorkoutStore';

export const useExercises = () => {
    const { exercises, addExercise, deleteExercise } = useWorkoutStore();
    return { exercises, addExercise, deleteExercise };
};
