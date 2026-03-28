import { describe, it, expect, vi, beforeEach } from 'vitest';
import { 
    signInWithEmailAndPassword, 
    signOut as firebaseSignOut, 
    createUserWithEmailAndPassword,
    sendPasswordResetEmail 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { authService } from '../services/auth.service';

vi.mock('firebase/auth');
vi.mock('firebase/firestore');
vi.mock('@/services/firebase', () => ({
    auth: { currentUser: { uid: '123' } },
    db: {}
}));

describe('AuthService', () => {
    const mockUser = {
        email: 'test@example.com',
        username: 'testuser',
        gender: 'Male' as const,
        dob: '2000-01-01'
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should sign in with email and password', async () => {
        const signinSpy = vi.mocked(signInWithEmailAndPassword).mockResolvedValue({ user: { uid: '123' } } as any);
        await authService.signInWithEmail('test@example.com', 'pass123');
        expect(signinSpy).toHaveBeenCalled();
    });

    it('should sign out', async () => {
        const signoutSpy = vi.mocked(firebaseSignOut).mockResolvedValue();
        await authService.signOut();
        expect(signoutSpy).toHaveBeenCalled();
    });

    it('should sign up with email', async () => {
        vi.mocked(createUserWithEmailAndPassword).mockResolvedValue({ user: { uid: '123' } } as any);
        vi.mocked(doc).mockReturnValue({ id: '123' } as any);
        const setDocSpy = vi.mocked(setDoc).mockResolvedValue();

        await authService.signUpWithEmail({ ...mockUser, password: 'password123' });
        
        expect(setDocSpy).toHaveBeenCalled();
    });

    it('should reset user password', async () => {
        const resetSpy = vi.mocked(sendPasswordResetEmail).mockResolvedValue();
        await authService.resetUserPassword('test@example.com');
        expect(resetSpy).toHaveBeenCalledWith(expect.anything(), 'test@example.com');
    });

    it('should fetch user data from firestore', async () => {
        vi.mocked(getDoc).mockResolvedValue({
            exists: () => true,
            data: () => mockUser
        } as any);
        
        const data = await authService.getUserData('123');
        expect(data).toEqual(mockUser);
    });
});
