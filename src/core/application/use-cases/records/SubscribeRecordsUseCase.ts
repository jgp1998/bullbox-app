import { RecordRepository } from '../../../domain/repositories/RecordRepository';
import { WorkoutRecord } from '../../../domain/models/Record';

export class SubscribeRecordsUseCase {
  constructor(private recordRepository: RecordRepository) {}

  execute(uid: string | undefined, callback: (records: WorkoutRecord[]) => void): () => void {
    if (!uid) return () => {};
    return this.recordRepository.subscribeToRecords(uid, callback);
  }
}
