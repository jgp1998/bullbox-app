import { create } from 'zustand';
import { auth, db } from '../services/firebase';
import { 
    onAuthStateChanged, 
    signInWithEmailAndPassword, 
    signOut, 
    createUserWithEmailAndPassword 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from '../types';

interface AuthState {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (newUser: User & { password: string }) => Promise<void>;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => {
    // Listen for auth changes
    onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (userDoc.exists()) {
                set({ user: userDoc.data() as User, isLoading: false });
            } else {
                // If auth exists but no doc, we might need to create it 
                // but usually handled in register
                set({ user: { 
                    email: firebaseUser.email || '', 
                    username: firebaseUser.displayName || 'User',
                    gender: 'Other',
                    dob: ''
                }, isLoading: false });
            }
        } else {
            set({ user: null, isLoading: false });
        }
    });

    return {
        user: null,
        isLoading: true,
        setUser: (user) => set({ user }),
        login: async (email, password) => {
            await signInWithEmailAndPassword(auth, email, password);
        },
        logout: async () => {
            await signOut(auth);
            set({ user: null });
        },
        register: async ({ password, ...userData }) => {
            const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, userData.email, password);
            await setDoc(doc(db, 'users', firebaseUser.uid), userData);
            set({ user: userData });
        },
    };
});
