import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FeedbackForm from './FeedbackForm';
import { useI18n } from '@/shared/context/i18n';
import { useAuthStore } from '@/features/auth';
import { feedbackRepository } from '@/core/infrastructure';

// Mock Dependencies
vi.mock('@/shared/context/i18n', () => ({
  useI18n: vi.fn(),
}));

vi.mock('@/features/auth', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('@/core/infrastructure', () => ({
  feedbackRepository: {
    save: vi.fn(),
  },
}));

describe('FeedbackForm', () => {
  const mockT = vi.fn((key: string) => key);
  const mockUser = {
    uid: 'user-123',
    username: 'TestUser',
    email: 'test@example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useI18n as any).mockReturnValue({ t: mockT });
    (useAuthStore as any).mockReturnValue({ user: mockUser });
  });

  it('renders correctly with initial state', () => {
    render(<FeedbackForm />);
    
    // Using getAllByText and checking for labels specifically if getByLabelText fails
    expect(screen.getByText('feedback.category')).toBeInTheDocument();
    expect(screen.getByText('feedback.messageLabel')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /feedback\.submit/i })).toBeDisabled();
  });

  it('enables submit button when message is entered', () => {
    render(<FeedbackForm />);
    
    const textarea = screen.getByRole('textbox'); // Textarea usually has textbox role
    fireEvent.change(textarea, { target: { value: 'Something to improve' } });
    
    expect(screen.getByRole('button', { name: /feedback\.submit/i })).toBeEnabled();
  });

  it('submits feedback successfully', async () => {
    vi.mocked(feedbackRepository.save).mockResolvedValue(undefined);
    
    render(<FeedbackForm />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'This is a great app!' } });
    
    const submitBtn = screen.getByRole('button', { name: /feedback\.submit/i });
    fireEvent.click(submitBtn);
    
    await screen.findByText('feedback.successTitle');
    
    expect(feedbackRepository.save).toHaveBeenCalledWith({
      userId: mockUser.uid,
      username: mockUser.username,
      email: mockUser.email,
      message: 'This is a great app!',
      category: 'improvement',
    });
  });

  it('shows error if submission fails', async () => {
    vi.mocked(feedbackRepository.save).mockRejectedValue(new Error('Failed'));
    
    render(<FeedbackForm />);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Error test' } });
    
    fireEvent.click(screen.getByRole('button', { name: /feedback\.submit/i }));
    
    await screen.findByText('feedback.errorSending');
  });

  it('calls onSuccess callback after delay', async () => {
    vi.useFakeTimers();
    const onSuccessMock = vi.fn();
    vi.mocked(feedbackRepository.save).mockResolvedValue(undefined);
    
    render(<FeedbackForm onSuccess={onSuccessMock} />);
    
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Success' } });
    fireEvent.click(screen.getByRole('button', { name: /feedback\.submit/i }));
    
    // We need to wait for the promise to resolve first
    // Since we are using fake timers, we might need to use vi.advanceTimersToNextTimer() or similar
    // for the microtasks to flush
    await Promise.resolve();
    await Promise.resolve();
    
    vi.advanceTimersByTime(2100);
    expect(onSuccessMock).toHaveBeenCalled();
    
    vi.useRealTimers();
  });
});
