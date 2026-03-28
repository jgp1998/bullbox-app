import { useAuthStore } from '../store/useAuthStore';

export const useAuth = () => {
    const { user, login, logout, register, isLoading } = useAuthStore();
    return { user, login, logout, register, isLoading };
};
