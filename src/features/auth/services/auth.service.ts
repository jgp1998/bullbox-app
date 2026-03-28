import { 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut, 
    createUserWithEmailAndPassword,
    onAuthStateChanged,
    sendPasswordResetEmail,
    User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/services/firebase';
import { User } from '../types';

export const authService = {
  signInWithEmail: async (email: string, password: string) => {
    return await signInWithEmailAndPassword(auth, email, password);
  },

  signOut: async () => {
    return await firebaseSignOut(auth);
  },

  signUpWithEmail: async (userData: User & { password: string }) => {
    const { password, ...rest } = userData;
    const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, userData.email, password);
    await setDoc(doc(db, 'users', firebaseUser.uid), rest);
    return firebaseUser;
  },

  resetUserPassword: async (email: string) => {
    return await sendPasswordResetEmail(auth, email);
  },

  subscribeToAuthChanges: (callback: (user: FirebaseUser | null) => void) => {
    return onAuthStateChanged(auth, callback);
  },

  getUserData: async (uid: string): Promise<User | null> => {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      return userDoc.data() as User;
    }
    return null;
  }
};
