export type FeedbackCategory = 'bug' | 'improvement' | 'compliment' | 'other';

export interface Feedback {
  id?: string;
  userId: string;
  username: string;
  email: string;
  message: string;
  category: FeedbackCategory;
  createdAt: number;
}
