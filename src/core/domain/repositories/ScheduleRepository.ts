import { ScheduledSession } from '../models/Schedule';

export interface ScheduleRepository {
  subscribeToSchedule(uid: string, callback: (sessions: ScheduledSession[]) => void): () => void;
  addSession(uid: string, session: Omit<ScheduledSession, 'id'>): Promise<void>;
  updateSession(uid: string, session: ScheduledSession): Promise<void>;
  deleteSession(uid: string, id: string): Promise<void>;
}
