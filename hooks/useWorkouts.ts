import { useWorkoutStore } from '../store/useWorkoutStore';

export const useWorkouts = () => {
    const { records, addRecord, deleteRecord, getPersonalBests } = useWorkoutStore();
    const personalBests = getPersonalBests();
    
    return {
        records,
        addRecord,
        deleteRecord,
        personalBests
    };
};
