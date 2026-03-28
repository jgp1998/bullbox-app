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
import { db, auth } from '@/services/firebase';
import { WorkoutRecord } from '../types';

export class RecordsService {
  private static getCollectionPath() {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    return collection(db, 'users', user.uid, 'workouts');
  }

  static subscribeToRecords(callback: (records: WorkoutRecord[]) => void) {
    try {
      const recordsQuery = query(
        this.getCollectionPath(),
        orderBy('date', 'desc')
      );

      return onSnapshot(recordsQuery, (snapshot: QuerySnapshot<DocumentData>) => {
        const records = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as WorkoutRecord[];
        callback(records);
      });
    } catch (error) {
      console.error('Error subscribing to records:', error);
      return () => {};
    }
  }

  static async addRecord(record: Omit<WorkoutRecord, 'id'>): Promise<void> {
    const colRef = this.getCollectionPath();
    await addDoc(colRef, record);
  }

  static async deleteRecord(id: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    await deleteDoc(doc(db, 'users', user.uid, 'workouts', id));
  }
}
