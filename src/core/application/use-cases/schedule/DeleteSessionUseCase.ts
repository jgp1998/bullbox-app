import { ScheduleRepository } from '../../../domain/repositories/ScheduleRepository';

export class DeleteSessionUseCase {
  constructor(private scheduleRepository: ScheduleRepository) {}

  async execute(uid: string | undefined, id: string): Promise<void> {
    if (!uid) throw new Error('User not authenticated');
    return this.scheduleRepository.deleteSession(uid, id);
  }
}
