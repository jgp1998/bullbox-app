import { 
  doc, 
  onSnapshot, 
  updateDoc, 
  arrayUnion, 
  arrayRemove
} from 'firebase/firestore';
import { db } from '@/services/firebase';
import { WorkoutRepository } from '../../domain/repositories/WorkoutRepository';

export class FirebaseWorkoutRepository implements WorkoutRepository {
  subscribeToExercises(uid: string, callback: (exercises: string[]) => void): () => void {
    const userDocRef = doc(db, 'users', uid);
    
    return onSnapshot(userDocRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data && data.exercises) {
          callback(data.exercises);
        }
      }
    }, (error) => {
      console.error('Error in FirebaseWorkoutRepository.subscribeToExercises:', error);
    });
  }

  async addExercise(uid: string, exercise: string): Promise<void> {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      exercises: arrayUnion(exercise)
    });
  }

  async deleteExercise(uid: string, exercise: string): Promise<void> {
    const userDocRef = doc(db, 'users', uid);
    await updateDoc(userDocRef, {
      exercises: arrayRemove(exercise)
    });
  }
}
