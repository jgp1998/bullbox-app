import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { themes } from '../constants';
import { Theme, ScheduledSession } from '../types';

interface UIState {
    theme: Theme;
    modals: {
        analysis: boolean;
        exerciseManager: boolean;
        exerciseDetail: boolean;
        schedule: boolean;
    };
    editingSession: ScheduledSession | null;
    schedulingInitialDate: string | null;
    currentExerciseDetail: string | null;
    
    // Actions
    setTheme: (theme: Theme) => void;
    openModal: (modalName: keyof UIState['modals'], data?: any) => void;
    closeModal: (modalName: keyof UIState['modals']) => void;
    applyTheme: () => void;
}

export const useUIStore = create<UIState>()(
    persist(
        (set, get) => ({
            theme: themes[0],
            modals: {
                analysis: false,
                exerciseManager: false,
                exerciseDetail: false,
                schedule: false,
            },
            editingSession: null,
            schedulingInitialDate: null,
            currentExerciseDetail: null,

            setTheme: (theme) => {
                set({ theme });
                get().applyTheme();
            },

            applyTheme: () => {
                const { theme } = get();
                const root = document.documentElement;
                Object.entries(theme.colors).forEach(([key, value]) => {
                    root.style.setProperty(key, value as string);
                });
            },

            openModal: (modalName, data) => {
                set((state) => ({
                    modals: { ...state.modals, [modalName]: true },
                    editingSession: modalName === 'schedule' && typeof data === 'object' ? (data || null) : (modalName === 'schedule' ? null : state.editingSession),
                    schedulingInitialDate: modalName === 'schedule' && typeof data === 'string' ? data : (modalName === 'schedule' ? null : state.schedulingInitialDate),
                    currentExerciseDetail: modalName === 'exerciseDetail' ? (data || null) : state.currentExerciseDetail,
                }));
            },

            closeModal: (modalName) => {
                set((state) => ({
                    modals: { ...state.modals, [modalName]: false },
                    editingSession: modalName === 'schedule' ? null : state.editingSession,
                    schedulingInitialDate: modalName === 'schedule' ? null : state.schedulingInitialDate,
                    currentExerciseDetail: modalName === 'exerciseDetail' ? null : state.currentExerciseDetail,
                }));
            },
        }),
        {
            name: 'bullbox-ui-storage',
            partialize: (state) => ({ theme: state.theme }), // Only persist the theme
        }
    )
);
