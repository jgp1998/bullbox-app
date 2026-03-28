import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginScreen from '../components/LoginScreen';
import { useAuthStore } from '../store/useAuthStore';
import { useI18n } from '@/context/i18n';

// Mock Dependencies
vi.mock('@/context/i18n', () => ({
    useI18n: vi.fn(() => ({
        t: vi.fn((key) => key), // Just return the key for simplicity
    })),
}));

vi.mock('../store/useAuthStore', () => ({
    useAuthStore: vi.fn(() => ({
        login: vi.fn(),
        register: vi.fn(),
        isLoading: false,
    })),
}));

// Mock PasswordResetModal to avoid rendering complexity
vi.mock('../components/PasswordResetModal', () => ({
    default: () => <div data-testid="reset-modal">Reset Modal</div>,
}));

describe('LoginScreen', () => {
    const mockLogin = vi.fn();
    const mockRegister = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAuthStore).mockReturnValue({
            login: mockLogin,
            register: mockRegister,
            isLoading: false,
        } as any);
    });

    it('should render login form initially', () => {
        render(<LoginScreen onLogin={() => {}} />);
        expect(screen.getByText('login.loginButton')).toBeDefined();
        expect(screen.getByText('login.switchToRegister')).toBeDefined();
    });

    it('should switch to registration mode on toggle', () => {
        render(<LoginScreen onLogin={() => {}} />);
        const toggleButton = screen.getByText('login.switchToRegister');
        fireEvent.click(toggleButton);
        expect(screen.getByText('login.registerButton')).toBeDefined();
        expect(screen.getByText('login.switchToLogin')).toBeDefined();
    });

    it('should call login store action on form submission', async () => {
        render(<LoginScreen onLogin={() => {}} />);
        
        // Fill form
        const usernameInput = screen.getByLabelText('login.username');
        const passwordInput = screen.getByLabelText('login.password');
        
        fireEvent.change(usernameInput, { target: { value: 'user1' } });
        fireEvent.change(passwordInput, { target: { value: 'pass123' } });
        
        const loginButton = screen.getByText('login.loginButton');
        fireEvent.click(loginButton);
        
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('user1', 'pass123');
        });
    });

    it('should call register store action on form submission', async () => {
        render(<LoginScreen onLogin={() => {}} />);
        
        // Switch to register
        fireEvent.click(screen.getByText('login.switchToRegister'));
        
        // Fill register form
        fireEvent.change(screen.getByLabelText('login.username'), { target: { value: 'newuser' } });
        fireEvent.change(screen.getByLabelText('login.email'), { target: { value: 'new@example.com' } });
        fireEvent.change(screen.getByLabelText('login.dob'), { target: { value: '2000-01-01' } });
        fireEvent.change(screen.getByLabelText('login.password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('login.confirmPassword'), { target: { value: 'password123' } });
        
        fireEvent.click(screen.getByText('login.registerButton'));
        
        await waitFor(() => {
            expect(mockRegister).toHaveBeenCalled();
        });
    });

    it('should show success message after successful registration', async () => {
        mockRegister.mockResolvedValueOnce({});
        render(<LoginScreen onLogin={() => {}} />);
        
        fireEvent.click(screen.getByText('login.switchToRegister'));
        
        fireEvent.change(screen.getByLabelText('login.username'), { target: { value: 'newuser' } });
        fireEvent.change(screen.getByLabelText('login.email'), { target: { value: 'new@example.com' } });
        fireEvent.change(screen.getByLabelText('login.dob'), { target: { value: '2000-01-01' } });
        fireEvent.change(screen.getByLabelText('login.password'), { target: { value: 'password123' } });
        fireEvent.change(screen.getByLabelText('login.confirmPassword'), { target: { value: 'password123' } });
        
        fireEvent.click(screen.getByText('login.registerButton'));
        
        await waitFor(() => {
            expect(screen.getByText('login.registerSuccess')).toBeDefined();
        });
    });
});
