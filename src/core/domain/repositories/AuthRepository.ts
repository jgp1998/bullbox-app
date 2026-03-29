import { User } from '../models/User';

export interface AuthRepository {
  signInWithEmail(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  signUpWithEmail(userData: Omit<User, 'uid'> & { password?: string }): Promise<User>;
  resetUserPassword(email: string): Promise<void>;
  subscribeToAuthChanges(callback: (user: User | null) => void): () => void;
  getUserData(uid: string): Promise<User | null>;
}
