import { Membership } from '@/core/domain/models/Membership';
import { User } from '@/core/domain/models/User';

export type { User };

export interface AuthState {
    user: User | null;
    memberships: Membership[];
    activeBoxId: string | null;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    register: (newUser: Omit<User, 'uid'> & { password: string }) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    setUser: (user: User | null) => void;
    setMemberships: (memberships: Membership[]) => void;
    setActiveBox: (boxId: string) => void;
}
