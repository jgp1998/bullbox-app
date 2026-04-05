import { useEffect } from 'react';
import { useScheduleStore } from '../store/useScheduleStore';
import { useAuthStore } from '../../auth/store/useAuthStore';
import { ScheduledSession } from '@/core/domain/models/Schedule';

export const useSchedule = () => {
    const { user } = useAuthStore();
    const { 
        scheduledSessions, 
        isLoading, 
        initialize, 
        addScheduledSession, 
        updateScheduledSession, 
        deleteScheduledSession 
    } = useScheduleStore();

    useEffect(() => {
        if (user) {
            const unsubscribe = initialize(user.uid);
            return () => unsubscribe();
        }
    }, [user, initialize]);

    const handleAddSession = (session: Omit<ScheduledSession, 'id'>) => addScheduledSession(session, user?.uid);
    const handleUpdateSession = (session: ScheduledSession) => updateScheduledSession(session, user?.uid);
    const handleDeleteSession = (id: string) => deleteScheduledSession(id, user?.uid);

    return { 
        scheduledSessions, 
        isLoading, 
        addScheduledSession: handleAddSession, 
        updateScheduledSession: handleUpdateSession, 
        deleteScheduledSession: handleDeleteSession 
    };
};
