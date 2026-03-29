import { RecordRepository } from '../../../domain/repositories/RecordRepository';

export class DeleteRecordUseCase {
  constructor(private recordRepository: RecordRepository) {}

  async execute(uid: string | undefined, id: string): Promise<void> {
    if (!uid) throw new Error('User not authenticated');
    return this.recordRepository.deleteRecord(uid, id);
  }
}
