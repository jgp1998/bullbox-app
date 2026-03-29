import { create } from 'zustand';
import { 
  loginUseCase, 
  logoutUseCase, 
  registerUseCase, 
  resetPasswordUseCase, 
  subscribeAuthChangesUseCase 
} from '@/src/core/application/use-cases/auth';
import { AuthState } from '../types';

export const useAuthStore = create<AuthState>((set) => {
    // Listen for auth changes
    subscribeAuthChangesUseCase.execute((user) => {
        set({ user, isLoading: false });
    });

    return {
        user: null,
        isLoading: true,
        setUser: (user) => set({ user }),
        login: async (email, password) => {
            const user = await loginUseCase.execute(email, password);
            set({ user });
        },
        logout: async () => {
            await logoutUseCase.execute();
            set({ user: null });
        },
        register: async (userData) => {
            const user = await registerUseCase.execute(userData);
            set({ user });
        },
        resetPassword: async (email: string) => {
            await resetPasswordUseCase.execute(email);
        },
    };
});
