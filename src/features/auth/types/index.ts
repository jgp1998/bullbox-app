export type { User } from '@/core/domain/models/User';
import { User } from '@/core/domain/models/User';

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (newUser: Omit<User, 'uid'> & { password: string }) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    setUser: (user: User | null) => void;
}
