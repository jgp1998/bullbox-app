import { Feedback } from '../models/Feedback';

export interface FeedbackRepository {
  save(feedback: Omit<Feedback, 'id'>): Promise<void>;
  getAll?(): Promise<Feedback[]>;
}
