import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAuthStore } from '../store/useAuthStore';
import { 
    loginUseCase, 
    logoutUseCase, 
    registerUseCase, 
    resetPasswordUseCase, 
  subscribeAuthChangesUseCase 
} from '@/core/application/use-cases/auth';
import { getUserMembershipsUseCase } from '@/core/application/use-cases/memberships';

const mockAuthCallback = vi.hoisted(() => ({ current: (user: any) => Promise.resolve() }));

vi.mock('@/core/application/use-cases/auth', () => ({
    loginUseCase: { execute: vi.fn() },
    logoutUseCase: { execute: vi.fn() },
    registerUseCase: { execute: vi.fn() },
    resetPasswordUseCase: { execute: vi.fn() },
    subscribeAuthChangesUseCase: { execute: vi.fn((cb) => { mockAuthCallback.current = cb; }) }
}));

vi.mock('@/core/application/use-cases/memberships', () => ({
    getUserMembershipsUseCase: { execute: vi.fn() }
}));

describe('useAuthStore', () => {
    const mockUser = {
        uid: '123',
        email: 'test@example.com',
        username: 'testuser',
        gender: 'Male' as const,
        dob: '2000-01-01'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Reset Zustand store
        useAuthStore.setState({ user: null, memberships: [], activeBoxId: null, isLoading: false });
        vi.mocked(getUserMembershipsUseCase.execute).mockResolvedValue([]);
    });

    it('should set user on successful login', async () => {
        vi.mocked(loginUseCase.execute).mockResolvedValue(mockUser);
        
        await useAuthStore.getState().login('test@example.com', 'pass123');
        expect(loginUseCase.execute).toHaveBeenCalledWith('test@example.com', 'pass123');
        expect(useAuthStore.getState().user).toEqual(mockUser);
    });

    it('should unset user on logout', async () => {
        vi.mocked(logoutUseCase.execute).mockResolvedValue();
        useAuthStore.setState({ user: mockUser });

        await useAuthStore.getState().logout();
        
        expect(logoutUseCase.execute).toHaveBeenCalled();
        expect(useAuthStore.getState().user).toBeNull();
    });

    it('should set user on registration', async () => {
        vi.mocked(registerUseCase.execute).mockResolvedValue(mockUser);
        
        const regData = { ...mockUser, password: 'password123' };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { uid, ...regDataWithoutUid } = regData;
        
        await useAuthStore.getState().register(regDataWithoutUid as any);
        
        expect(registerUseCase.execute).toHaveBeenCalled();
        expect(useAuthStore.getState().user).toEqual(mockUser);
    });

    it('should call resetPasswordUseCase', async () => {
        vi.mocked(resetPasswordUseCase.execute).mockResolvedValue();
        
        await useAuthStore.getState().resetPassword('test@example.com');
        expect(resetPasswordUseCase.execute).toHaveBeenCalledWith('test@example.com');
    });

    it('should behave according to auth changes', async () => {
        useAuthStore.getState().setUser(mockUser);
        expect(useAuthStore.getState().user).toEqual(mockUser);
    });

    it('should automatically set activeBoxId when memberships are fetched if not already set', async () => {
        const mockMemberships = [
            { id: 'm1', userId: '123', boxId: 'box-123', role: 'athlete', status: 'active' }
        ];
        vi.mocked(getUserMembershipsUseCase.execute).mockResolvedValue(mockMemberships as any);
        
        // Trigger the auth change callback using the captured reference
        await mockAuthCallback.current(mockUser);

        expect(useAuthStore.getState().activeBoxId).toBe('box-123');
        expect(localStorage.getItem('activeBoxId')).toBe('box-123');
    });
});
