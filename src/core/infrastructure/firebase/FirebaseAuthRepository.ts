import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/shared/services/firebase';
import { User } from '../../domain/models/User';
import { AuthRepository } from '../../domain/repositories/AuthRepository';
import { FirebaseUserMapper } from './FirebaseUserMapper';

export class FirebaseAuthRepository implements AuthRepository {
  async signInWithEmail(email: string, password: string): Promise<User> {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    const userData = await this.getUserData(user.uid);
    return FirebaseUserMapper.toDomain(user, userData);
  }

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  async signUpWithEmail(userData: Omit<User, 'uid'> & { password?: string }): Promise<User> {
    const { password, ...rest } = userData;
    if (!password) throw new Error('Password is required for sign up');

    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, userData.email, password);
    
    // Guardar datos adicionales en Firestore
    await setDoc(doc(db, 'users', firebaseUser.uid), {
      username: rest.username,
      gender: rest.gender,
      email: rest.email,
      dob: rest.dob
    });

    return FirebaseUserMapper.toDomain(firebaseUser, rest);
  }

  async resetUserPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(auth, email);
  }

  subscribeToAuthChanges(callback: (user: User | null) => void): () => void {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = await this.getUserData(firebaseUser.uid);
        callback(FirebaseUserMapper.toDomain(firebaseUser, userData));
      } else {
        callback(null);
      }
    });
  }

  async getUserData(uid: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      return {
        uid,
        username: data.username,
        email: data.email,
        gender: data.gender,
        dob: data.dob
      };
    }
    return null;
  }
}
