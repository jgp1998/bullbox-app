import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PasswordResetModal from '../components/PasswordResetModal';
import { useAuthStore } from '../store/useAuthStore';
import { useI18n } from '@/context/i18n';

// Mock Dependencies
vi.mock('@/context/i18n', () => ({
    useI18n: vi.fn(() => ({
        t: vi.fn((key) => key), // Just return the key
    })),
}));

vi.mock('../store/useAuthStore', () => ({
    useAuthStore: vi.fn(() => ({
        resetPassword: vi.fn(),
    })),
}));

// Mock Modal as it might have portals
vi.mock('@/src/shared/components/ui/Modal', () => ({
    default: ({ children, isOpen, onClose, title }: any) => isOpen ? (
        <div data-testid="modal">
            <h1>{title}</h1>
            {children}
            <button onClick={onClose}>Close</button>
        </div>
    ) : null,
}));

describe('PasswordResetModal', () => {
    const mockReset = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useAuthStore).mockReturnValue({
            resetPassword: mockReset,
        } as any);
    });

    it('should show reset form when open', () => {
        render(<PasswordResetModal isOpen={true} onClose={() => {}} />);
        expect(screen.getByText('modals.resetPasswordPrompt')).toBeDefined();
        expect(screen.getByLabelText('login.email')).toBeDefined();
    });

    it('should call resetPassword on submission', async () => {
        render(<PasswordResetModal isOpen={true} onClose={() => {}} />);
        
        fireEvent.change(screen.getByLabelText('login.email'), { target: { value: 'test@example.com' } });
        fireEvent.click(screen.getByText('modals.sendResetLink'));
        
        await waitFor(() => {
            expect(mockReset).toHaveBeenCalledWith('test@example.com');
        });
    });

    it('should show success message after submission', async () => {
        mockReset.mockResolvedValueOnce({} as any);
        render(<PasswordResetModal isOpen={true} onClose={() => {}} />);
        
        fireEvent.change(screen.getByLabelText('login.email'), { target: { value: 'test@example.com' } });
        fireEvent.click(screen.getByText('modals.sendResetLink'));
        
        await waitFor(() => {
            expect(screen.getByText('modals.resetSubmitted')).toBeDefined();
        });
    });
});

