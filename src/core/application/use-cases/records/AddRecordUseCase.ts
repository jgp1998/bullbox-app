import { RecordRepository } from '../../../domain/repositories/RecordRepository';
import { WorkoutRecord } from '../../../domain/models/Record';

export class AddRecordUseCase {
  constructor(private recordRepository: RecordRepository) {}

  async execute(uid: string | undefined, record: Omit<WorkoutRecord, 'id'>): Promise<void> {
    if (!uid) throw new Error('User not authenticated');
    return this.recordRepository.addRecord(uid, record);
  }
}
