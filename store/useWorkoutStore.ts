import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WorkoutRecord } from '../types';

interface WorkoutState {
    records: WorkoutRecord[];
    exercises: string[];
    addRecord: (record: Omit<WorkoutRecord, 'id'>) => void;
    deleteRecord: (id: string) => void;
    addExercise: (exercise: string) => void;
    deleteExercise: (exercise: string) => void;
    getPersonalBests: () => WorkoutRecord[];
}

export const useWorkoutStore = create<WorkoutState>()(
    persist(
        (set, get) => ({
            records: [],
            exercises: ['Back Squat', 'Deadlift', 'Clean & Jerk', 'Snatch', 'Fran (Time)'],
            
            addRecord: (record) => {
                const newRecord = { ...record, id: new Date().toISOString() };
                const updatedRecords = [newRecord, ...get().records].sort(
                    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
                );
                set({ records: updatedRecords });
            },

            deleteRecord: (id) => {
                set({ records: get().records.filter(r => r.id !== id) });
            },

            addExercise: (exercise) => {
                const updatedExercises = [...get().exercises, exercise].sort();
                set({ exercises: updatedExercises });
            },

            deleteExercise: (exerciseToDelete) => {
                set({ exercises: get().exercises.filter(ex => ex !== exerciseToDelete) });
            },

            getPersonalBests: () => {
                const bests = new Map<string, WorkoutRecord>();
                get().records.forEach(record => {
                    const existingBest = bests.get(record.exercise);
                    if (!existingBest) {
                        bests.set(record.exercise, record);
                        return;
                    }
                    if (record.type === 'Time' && record.value < existingBest.value) {
                        bests.set(record.exercise, record);
                    } else if (record.type !== 'Time' && record.value > existingBest.value) {
                        bests.set(record.exercise, record);
                    }
                });
                return Array.from(bests.values());
            },
        }),
        {
            name: 'bullbox-workout-storage',
        }
    )
);
