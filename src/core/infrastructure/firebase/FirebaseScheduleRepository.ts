import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  updateDoc
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import { ScheduleRepository } from '../../domain/repositories/ScheduleRepository';
import { ScheduledSession } from '../../domain/models/Schedule';

export class FirebaseScheduleRepository implements ScheduleRepository {
  subscribeToSchedule(uid: string, callback: (sessions: ScheduledSession[]) => void): () => void {
    const q = query(
      collection(db, 'users', uid, 'schedule'),
      orderBy('date', 'asc')
    );

    return onSnapshot(q, (snapshot) => {
      const sessions = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ScheduledSession[];
      callback(sessions);
    }, (error) => {
      console.error('Error in FirebaseScheduleRepository.subscribeToSchedule:', error);
    });
  }

  async addSession(uid: string, session: Omit<ScheduledSession, 'id'>): Promise<void> {
    const colRef = collection(db, 'users', uid, 'schedule');
    await addDoc(colRef, session);
  }

  async updateSession(uid: string, session: ScheduledSession): Promise<void> {
    const { id, ...data } = session;
    const docRef = doc(db, 'users', uid, 'schedule', id);
    await updateDoc(docRef, data);
  }

  async deleteSession(uid: string, id: string): Promise<void> {
    const docRef = doc(db, 'users', uid, 'schedule', id);
    await deleteDoc(docRef);
  }
}
