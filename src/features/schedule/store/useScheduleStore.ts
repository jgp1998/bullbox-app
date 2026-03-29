import { create } from 'zustand';
import { 
    subscribeScheduleUseCase, 
    addSessionUseCase, 
    updateSessionUseCase, 
    deleteSessionUseCase 
} from '@/src/core/application/use-cases/schedule';
import { ScheduledSession } from '@/src/core/domain/models/Schedule';

interface ScheduleState {
    scheduledSessions: ScheduledSession[];
    isLoading: boolean;
    initialize: (uid?: string) => () => void;
    addScheduledSession: (session: Omit<ScheduledSession, 'id'>, uid?: string) => Promise<void>;
    updateScheduledSession: (updatedSession: ScheduledSession, uid?: string) => Promise<void>;
    deleteScheduledSession: (id: string, uid?: string) => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
    scheduledSessions: [],
    isLoading: false,

    initialize: (uid?: string) => {
        if (!uid) return () => {};

        set({ isLoading: true });

        const unsubscribe = subscribeScheduleUseCase.execute(uid, (sessions) => {
            set({ scheduledSessions: sessions, isLoading: false });
        });

        return unsubscribe;
    },

    addScheduledSession: async (session, uid?: string) => {
        if (!uid) return;
        await addSessionUseCase.execute(uid, session);
    },

    updateScheduledSession: async (updatedSession, uid?: string) => {
        if (!uid) return;
        await updateSessionUseCase.execute(uid, updatedSession);
    },

    deleteScheduledSession: async (id, uid?: string) => {
        if (!uid) return;
        await deleteSessionUseCase.execute(uid, id);
    },
}));
