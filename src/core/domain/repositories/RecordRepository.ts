import { WorkoutRecord } from '../models/Record';

export interface RecordRepository {
  subscribeToRecords(uid: string, callback: (records: WorkoutRecord[]) => void): () => void;
  addRecord(uid: string, record: Omit<WorkoutRecord, 'id'>): Promise<void>;
  deleteRecord(uid: string, id: string): Promise<void>;
}
