import { create } from 'zustand';
import { db, auth } from '../services/firebase';
import { 
    collection, 
    addDoc, 
    deleteDoc, 
    doc, 
    onSnapshot, 
    query, 
    orderBy,
    setDoc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove
} from 'firebase/firestore';
import { WorkoutRecord } from '../types';
import { calculate1RM, lbsToKg } from '../utils/formatters';

interface WorkoutState {
    records: WorkoutRecord[];
    exercises: string[];
    isLoading: boolean;
    initialize: () => () => void;
    addRecord: (record: Omit<WorkoutRecord, 'id'>) => Promise<void>;
    deleteRecord: (id: string) => Promise<void>;
    addExercise: (exercise: string) => Promise<void>;
    deleteExercise: (exercise: string) => Promise<void>;
    getPersonalBests: () => WorkoutRecord[];
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
    records: [],
    exercises: ['Back Squat', 'Deadlift', 'Clean & Jerk', 'Snatch', 'Fran (Time)'],
    isLoading: false,

    initialize: () => {
        const user = auth.currentUser;
        if (!user) return () => {};

        set({ isLoading: true });

        // Subscribe to records
        const recordsQuery = query(
            collection(db, 'users', user.uid, 'workouts'),
            orderBy('date', 'desc')
        );

        const unsubscribeRecords = onSnapshot(recordsQuery, (snapshot) => {
            const records = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as WorkoutRecord[];
            set({ records, isLoading: false });
        });

        // Subscribe to exercises (stored in a single doc for the user)
        const userDocRef = doc(db, 'users', user.uid);
        const unsubscribeUser = onSnapshot(userDocRef, (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                if (data.exercises) {
                    set({ exercises: data.exercises });
                }
            }
        });

        return () => {
            unsubscribeRecords();
            unsubscribeUser();
        };
    },
    
    addRecord: async (record) => {
        const user = auth.currentUser;
        if (!user) return;
        await addDoc(collection(db, 'users', user.uid, 'workouts'), record);
    },

    deleteRecord: async (id) => {
        const user = auth.currentUser;
        if (!user) return;
        await deleteDoc(doc(db, 'users', user.uid, 'workouts', id));
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

    getPersonalBests: () => {
        const bests = new Map<string, WorkoutRecord>();

        get().records.forEach(record => {
            const exercise = record.exercise;
            const existingBest = bests.get(exercise);
            
            if (!existingBest) {
                bests.set(exercise, record);
                return;
            }

            // If it's a time-based exercise (no weight)
            if (record.time && !record.weight) {
                if (!existingBest.time || (record.time < (existingBest.time || Infinity))) {
                    bests.set(exercise, record);
                }
                return;
            }

            // Weight-based (calc 1RM)
            const getRM = (rec: WorkoutRecord) => {
                let w = rec.weight || 0;
                if (rec.unit === 'lbs') w = lbsToKg(w);
                return calculate1RM(w, rec.reps);
            };

            const recordRM = getRM(record);
            const existingRM = getRM(existingBest);

            if (recordRM > existingRM) {
                bests.set(exercise, record);
            }
        });
        return Array.from(bests.values());
    },
}));
