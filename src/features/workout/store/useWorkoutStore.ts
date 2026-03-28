import { create } from 'zustand';
import { db, auth } from '@/services/firebase';
import { 
    doc, 
    onSnapshot, 
    updateDoc, 
    arrayUnion, 
    arrayRemove
} from 'firebase/firestore';
import { WorkoutState } from '../types';
import { DEFAULT_EXERCISES } from '../constants';

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
    exercises: DEFAULT_EXERCISES,
    isLoading: false,

    initialize: () => {
        const user = auth.currentUser;
        if (!user) return () => {};

        set({ isLoading: true });

        // Subscribe to exercises (stored in a single doc for the user)
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                if (data.exercises) {
                    set({ exercises: data.exercises });
                }
            }
            set({ isLoading: false });
        });

        return () => {
            unsubscribeUser();
        };
    },
    
    addExercise: async (exercise) => {
        const user = auth.currentUser;
        if (!user) return;
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
            exercises: arrayUnion(exercise)
        });
    },

    deleteExercise: async (exerciseToDelete) => {
        const user = auth.currentUser;
        if (!user) return;
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
            exercises: arrayRemove(exerciseToDelete)
        });
    },
}));
