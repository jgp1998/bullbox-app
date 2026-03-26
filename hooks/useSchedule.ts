import { useScheduleStore } from '../store/useScheduleStore';

export const useSchedule = () => {
    const { scheduledSessions, addScheduledSession, updateScheduledSession, deleteScheduledSession } = useScheduleStore();
    return { scheduledSessions, addScheduledSession, updateScheduledSession, deleteScheduledSession };
};
