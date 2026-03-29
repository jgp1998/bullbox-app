import { ScheduleRepository } from '../../../domain/repositories/ScheduleRepository';
import { ScheduledSession } from '../../../domain/models/Schedule';

export class AddSessionUseCase {
  constructor(private scheduleRepository: ScheduleRepository) {}

  async execute(uid: string | undefined, session: Omit<ScheduledSession, 'id'>): Promise<void> {
    if (!uid) throw new Error('User not authenticated');
    return this.scheduleRepository.addSession(uid, session);
  }
}
