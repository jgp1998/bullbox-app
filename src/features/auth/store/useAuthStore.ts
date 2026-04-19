import { create } from 'zustand';
import { 
  loginUseCase, 
  logoutUseCase, 
  registerUseCase, 
  resetPasswordUseCase, 
  subscribeAuthChangesUseCase 
} from '@/core/application/use-cases/auth';
import { getUserMembershipsUseCase } from '@/core/application/use-cases/memberships';
import { AuthState } from '../types';

export const useAuthStore = create<AuthState>((set) => {
    // Listen for auth changes
    subscribeAuthChangesUseCase.execute(async (user) => {
        if (user) {
            const memberships = await getUserMembershipsUseCase.execute(user.uid);
            const currentActiveBoxId = localStorage.getItem('activeBoxId');
            
            // If no active box in localStorage, set the first membership's box as active
            let activeBoxId = currentActiveBoxId;
            if (!activeBoxId && memberships.length > 0) {
                activeBoxId = memberships[0].boxId;
                localStorage.setItem('activeBoxId', activeBoxId);
            }

            set({ user, memberships, activeBoxId, isLoading: false });
        } else {
            set({ user: null, memberships: [], activeBoxId: null, isLoading: false });
        }
    });

    return {
        user: null,
        memberships: [],
        activeBoxId: localStorage.getItem('activeBoxId') || null,
        isLoading: true,
        setUser: (user) => set({ user }),
        setMemberships: (memberships) => set({ memberships }),
        setActiveBox: (boxId) => {
            localStorage.setItem('activeBoxId', boxId);
            set({ activeBoxId: boxId });
        },
        login: async (email, password) => {
            const user = await loginUseCase.execute(email, password);
            set({ user });
            // Note: AppInitializer will handle fetching memberships
        },
        logout: async () => {
            await logoutUseCase.execute();
            localStorage.removeItem('activeBoxId');
            set({ user: null, memberships: [], activeBoxId: null });
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
