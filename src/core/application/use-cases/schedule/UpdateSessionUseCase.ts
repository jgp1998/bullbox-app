import { ScheduleRepository } from '../../../domain/repositories/ScheduleRepository';
import { ScheduledSession } from '../../../domain/models/Schedule';

export class UpdateSessionUseCase {
  constructor(private scheduleRepository: ScheduleRepository) {}

  async execute(uid: string | undefined, session: ScheduledSession): Promise<void> {
    if (!uid) throw new Error('User not authenticated');
    return this.scheduleRepository.updateSession(uid, session);
  }
}
