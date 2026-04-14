import { describe, it, expect, vi, beforeEach } from 'vitest';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FirebaseFeedbackRepository } from './FirebaseFeedbackRepository';
import { db } from '@/shared/services/firebase';

// Mock Firebase Firestore
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(() => 'mocked-timestamp'),
}));

// Mock the db instance
vi.mock('@/shared/services/firebase', () => ({
  db: { id: 'mock-db' },
}));

describe('FirebaseFeedbackRepository', () => {
  let repository: FirebaseFeedbackRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new FirebaseFeedbackRepository();
  });

  it('should save feedback correctly to Firestore', async () => {
    const mockFeedback = {
      userId: 'user-123',
      username: 'jgp1998',
      email: 'jorge@example.com',
      message: 'Great app!',
      category: 'compliment' as const,
    };

    const mockCollection = { id: 'feedback-collection' };
    vi.mocked(collection).mockReturnValue(mockCollection as any);
    vi.mocked(addDoc).mockResolvedValue({ id: 'doc-123' } as any);

    await repository.save(mockFeedback);

    expect(collection).toHaveBeenCalledWith(db, 'feedback');
    expect(addDoc).toHaveBeenCalledWith(mockCollection, {
      ...mockFeedback,
      createdAt: 'mocked-timestamp',
    });
  });

  it('should throw an error if addDoc fails', async () => {
    const mockFeedback = {
      userId: 'user-123',
      username: 'jgp1998',
      email: 'jorge@example.com',
      message: 'Great app!',
      category: 'compliment' as const,
    };

    vi.mocked(addDoc).mockRejectedValue(new Error('Firestore error'));

    await expect(repository.save(mockFeedback)).rejects.toThrow('Failed to save feedback');
  });
});
