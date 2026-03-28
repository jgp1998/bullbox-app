import { create } from 'zustand';
import { db, auth } from '../services/firebase';
import { 
    doc, 
    onSnapshot, 
    updateDoc, 
    arrayUnion, 
    arrayRemove
} from 'firebase/firestore';

interface WorkoutState {
    exercises: string[];
    isLoading: boolean;
    initialize: () => () => void;
    addExercise: (exercise: string) => Promise<void>;
    deleteExercise: (exercise: string) => Promise<void>;
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
    exercises: ['Back Squat', 'Deadlift', 'Clean & Jerk', 'Snatch', 'Fran (Time)'],
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
