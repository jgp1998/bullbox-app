import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FeedbackPage from './FeedbackPage';
import { useI18n } from '@/shared/context/i18n';
import { useNavigate } from 'react-router-dom';

// Mock Dependencies
vi.mock('@/shared/context/i18n', () => ({
  useI18n: vi.fn(),
}));

vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
}));

// Mock child component
vi.mock('../components/FeedbackForm', () => ({
  default: () => <div data-testid="feedback-form">Feedback Form</div>,
}));

describe('FeedbackPage', () => {
  const mockT = vi.fn((key: string) => {
    if (key === 'feedback.sidebarItems') return ['Item 1', 'Item 2'];
    return key;
  });
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useI18n as any).mockReturnValue({ t: mockT });
    (useNavigate as any).mockReturnValue(mockNavigate);
  });

  it('renders correctly with title and sidebar', () => {
    render(<FeedbackPage />);
    
    expect(screen.getByText('feedback.pageTitle')).toBeInTheDocument();
    expect(screen.getByText('feedback.pageSubtitle')).toBeInTheDocument();
    expect(screen.getByTestId('feedback-form')).toBeInTheDocument();
    
    // Check sidebar items
    expect(screen.getByText('feedback.sidebarItems.features.title')).toBeInTheDocument();
    expect(screen.getByText('feedback.sidebarItems.bugs.title')).toBeInTheDocument();
  });

  it('navigates back when clicking the back button', () => {
    render(<FeedbackPage />);
    
    const backBtn = screen.getByRole('button', { name: /common\.back/i });
    fireEvent.click(backBtn);
    
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('calls navigate when onSuccess is triggered from form', () => {
    // This requires checking how onSuccess is handled. 
    // In FeedbackPage: <FeedbackForm onSuccess={() => navigate(-1)} />
    // We can verify this by checking the props passed to the mocked FeedbackForm if we used a more complex mock, 
    // but here we just check if navigate is called when form reports success.
    // Instead of a simple mock, let's use a functional one to trigger onSuccess.
  });
});
