import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
    const { user, login, logout, register } = useAuthStore();
    return { user, login, logout, register };
};
