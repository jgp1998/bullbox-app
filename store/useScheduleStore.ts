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
    updateDoc
} from 'firebase/firestore';
import { ScheduledSession } from '../types';

interface ScheduleState {
    scheduledSessions: ScheduledSession[];
    isLoading: boolean;
    initialize: () => () => void;
    addScheduledSession: (session: Omit<ScheduledSession, 'id'>) => Promise<void>;
    updateScheduledSession: (updatedSession: ScheduledSession) => Promise<void>;
    deleteScheduledSession: (id: string) => Promise<void>;
}

export const useScheduleStore = create<ScheduleState>((set, get) => ({
    scheduledSessions: [],
    isLoading: false,

    initialize: () => {
        const user = auth.currentUser;
        if (!user) return () => {};

        set({ isLoading: true });

        const q = query(
            collection(db, 'users', user.uid, 'schedule'),
            orderBy('date', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const sessions = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as ScheduledSession[];
            set({ scheduledSessions: sessions, isLoading: false });
        });

        return unsubscribe;
    },

    addScheduledSession: async (session) => {
        const user = auth.currentUser;
        if (!user) return;
        await addDoc(collection(db, 'users', user.uid, 'schedule'), session);
    },

    updateScheduledSession: async (updatedSession) => {
        const user = auth.currentUser;
        if (!user) return;
        const { id, ...data } = updatedSession;
        await updateDoc(doc(db, 'users', user.uid, 'schedule', id), data);
    },

    deleteScheduledSession: async (id) => {
        const user = auth.currentUser;
        if (!user) return;
        await deleteDoc(doc(db, 'users', user.uid, 'schedule', id));
    },
}));
