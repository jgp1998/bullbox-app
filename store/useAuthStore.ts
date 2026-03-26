import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../types';

interface AuthState {
    user: User | null;
    login: (user: User) => void;
    logout: () => void;
    register: (newUser: User) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            login: (user) => set({ user }),
            logout: () => set({ user: null }),
            register: (newUser) => {
                const storedUsers = localStorage.getItem('bullboxUsers');
                const users: User[] = storedUsers ? JSON.parse(storedUsers) : [];
                const updatedUsers = [...users, newUser];
                localStorage.setItem('bullboxUsers', JSON.stringify(updatedUsers));
                set({ user: newUser });
            },
        }),
        {
            name: 'bullbox-auth-storage',
            partialize: (state) => ({ user: state.user }),
        }
    )
);
