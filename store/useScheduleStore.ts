import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ScheduledSession } from '../types';

interface ScheduleState {
    scheduledSessions: ScheduledSession[];
    addScheduledSession: (session: Omit<ScheduledSession, 'id'>) => void;
    updateScheduledSession: (updatedSession: ScheduledSession) => void;
    deleteScheduledSession: (id: string) => void;
}

export const useScheduleStore = create<ScheduleState>()(
    persist(
        (set, get) => ({
            scheduledSessions: [],

            addScheduledSession: (session) => {
                const newSession = { ...session, id: new Date().toISOString() };
                set({ scheduledSessions: [...get().scheduledSessions, newSession] });
            },

            updateScheduledSession: (updatedSession) => {
                const updatedSessions = get().scheduledSessions.map(s => 
                    s.id === updatedSession.id ? updatedSession : s
                );
                set({ scheduledSessions: updatedSessions });
            },

            deleteScheduledSession: (id) => {
                set({ scheduledSessions: get().scheduledSessions.filter(s => s.id !== id) });
            },
        }),
        {
            name: 'bullbox-schedule-storage',
        }
    )
);
