import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  QuerySnapshot,
  DocumentData
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import { RecordRepository } from '../../domain/repositories/RecordRepository';
import { WorkoutRecord } from '../../domain/models/Record';

export class FirebaseRecordRepository implements RecordRepository {
  subscribeToRecords(uid: string, callback: (records: WorkoutRecord[]) => void): () => void {
    const recordsQuery = query(
      collection(db, 'users', uid, 'workouts'),
      orderBy('date', 'desc')
    );

    return onSnapshot(
      recordsQuery, 
      (snapshot: QuerySnapshot<DocumentData>) => {
        const records = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as WorkoutRecord[];
        callback(records);
      },
      (error) => {
        console.error('Error in FirebaseRecordRepository.subscribeToRecords:', error);
      }
    );
  }

  async addRecord(uid: string, record: Omit<WorkoutRecord, 'id'>): Promise<void> {
    const colRef = collection(db, 'users', uid, 'workouts');
    await addDoc(colRef, record);
  }

  async deleteRecord(uid: string, id: string): Promise<void> {
    const docRef = doc(db, 'users', uid, 'workouts', id);
    await deleteDoc(docRef);
  }
}
