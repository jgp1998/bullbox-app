import { create } from 'zustand';
import { authService } from '../services/auth.service';
import { AuthState, User } from '../types';

export const useAuthStore = create<AuthState>((set) => {
    // Listen for auth changes
    authService.subscribeToAuthChanges(async (firebaseUser) => {
        if (firebaseUser) {
            const userData = await authService.getUserData(firebaseUser.uid);
            if (userData) {
                set({ user: userData, isLoading: false });
            } else {
                // If auth exists but no doc, assume fallback values
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
            await authService.signInWithEmail(email, password);
        },
        logout: async () => {
            await authService.signOut();
            set({ user: null });
        },
        register: async (userData) => {
            await authService.signUpWithEmail(userData);
            const { password: _, ...rest } = userData;
            set({ user: rest });
        },
        resetPassword: async (email: string) => {
            await authService.resetUserPassword(email);
        },
    };
});
