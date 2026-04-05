import { 
  doc, 
  onSnapshot, 
  setDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove
} from 'firebase/firestore';
import { db } from '@/shared/services/firebase';
import { WorkoutRepository } from '../../domain/repositories/WorkoutRepository';

export class FirebaseWorkoutRepository implements WorkoutRepository {
  subscribeToExercises(uid: string, callback: (exercises: string[]) => void): () => void {
    const userDocRef = doc(db, 'users', uid);
    
    return onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        callback(data?.exercises || []);
      } else {
        // Document doesn't exist yet, return empty list or defaults as per store
        callback([]);
      }
    }, (error) => {
      console.error('Error in FirebaseWorkoutRepository.subscribeToExercises:', error);
    });
  }

  async addExercise(uid: string, exercise: string): Promise<void> {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      exercises: arrayUnion(exercise)
    }, { merge: true });
  }

  async deleteExercise(uid: string, exercise: string): Promise<void> {
    const userDocRef = doc(db, 'users', uid);
    await setDoc(userDocRef, {
      exercises: arrayRemove(exercise)
    }, { merge: true });
  }
}
