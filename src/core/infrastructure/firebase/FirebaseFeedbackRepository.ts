import { 
  collection, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '@/shared/services/firebase';
import { Feedback } from '../../domain/models/Feedback';
import { FeedbackRepository } from '../../domain/repositories/FeedbackRepository';

export class FirebaseFeedbackRepository implements FeedbackRepository {
  private readonly collectionName = 'feedback';

  async save(feedback: Omit<Feedback, 'id' | 'createdAt'>): Promise<void> {
    try {
      const feedbackCollection = collection(db, this.collectionName);
      await addDoc(feedbackCollection, {
        ...feedback,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error('Error saving feedback to Firestore:', error);
      throw new Error('Failed to save feedback');
    }
  }
}
