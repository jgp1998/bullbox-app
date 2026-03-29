import { ScheduleRepository } from '../../../domain/repositories/ScheduleRepository';
import { ScheduledSession } from '../../../domain/models/Schedule';

export class SubscribeScheduleUseCase {
  constructor(private scheduleRepository: ScheduleRepository) {}

  execute(uid: string | undefined, callback: (sessions: ScheduledSession[]) => void): () => void {
    if (!uid) return () => {};
    return this.scheduleRepository.subscribeToSchedule(uid, callback);
  }
}
