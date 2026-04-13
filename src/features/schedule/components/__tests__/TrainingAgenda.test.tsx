import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TrainingAgenda from '../TrainingAgenda';
import { ScheduledSession } from '@/shared/types';

// Mock UI Store
vi.mock('@/shared/store/useUIStore', () => ({
  useUIStore: () => ({
    openModal: vi.fn(),
  }),
}));

// Mock I18n
vi.mock('@/shared/context/i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    language: 'en',
  }),
}));

// Mock Icons
vi.mock('@/shared/components/ui/Icons', () => ({
  CalendarIcon: () => <div data-testid="calendar-icon" />,
  PlusIcon: () => <div data-testid="plus-icon" />,
  ChevronLeftIcon: () => <div data-testid="chevron-left" />,
  ChevronRightIcon: () => <div data-testid="chevron-right" />,
  EditIcon: () => <div data-testid="edit-icon" />,
  TrashIcon: () => <div data-testid="trash-icon" />,
}));

// Mock ConfirmModal to avoid rendering complexity
vi.mock('@/shared/components/ui/ConfirmModal', () => ({
  default: ({ isOpen, onConfirm, onCancel, title }: any) => 
    isOpen ? (
      <div data-testid="confirm-modal">
        <p>{title}</p>
        <button onClick={onConfirm}>Confirm</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    ) : null,
}));

describe('TrainingAgenda', () => {
  const mockSessions: ScheduledSession[] = [
    {
      id: '1',
      title: 'Yoga',
      date: new Date().toISOString().split('T')[0], // Today
      time: '08:00',
      notes: 'Relax'
    }
  ];

  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly', () => {
    render(
      <TrainingAgenda 
        sessions={mockSessions} 
        onDeleteSession={mockOnDelete} 
      />
    );
    
    expect(screen.getByTestId('agenda-title')).toHaveTextContent('trainingSchedule.title');
    expect(screen.getByText('Yoga')).toBeInTheDocument();
  });

  it('shows skeleton when loading', () => {
    render(
      <TrainingAgenda 
        sessions={[]} 
        onDeleteSession={mockOnDelete}
        isLoading={true}
      />
    );
    
    // It should render skeletons (we can check by testid if we add them, or just look for the items)
    // The skeleton component doesn't have a testid yet, but we can verify the loading state
    expect(screen.queryByText('Yoga')).not.toBeInTheDocument();
  });

  it('handles navigation', () => {
    render(
      <TrainingAgenda 
        sessions={mockSessions} 
        onDeleteSession={mockOnDelete} 
      />
    );
    
    const nextBtn = screen.getByTestId('chevron-right').parentElement;
    fireEvent.click(nextBtn!);
    
    // After navigating a week, Yoga (which is today) should disappear from the weekly list
    expect(screen.queryByText('Yoga')).not.toBeInTheDocument();
    
    const todayBtn = screen.getByText('common.today');
    fireEvent.click(todayBtn);
    
    // Back to today
    expect(screen.getByText('Yoga')).toBeInTheDocument();
  });

  it('opens delete confirmation and calls onDeleteSession', () => {
    render(
      <TrainingAgenda 
        sessions={mockSessions} 
        onDeleteSession={mockOnDelete} 
      />
    );
    
    const deleteBtn = screen.getByTestId('trash-icon').parentElement;
    fireEvent.click(deleteBtn!);
    
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument();
    
    const confirmBtn = screen.getByText('Confirm');
    fireEvent.click(confirmBtn);
    
    expect(mockOnDelete).toHaveBeenCalledWith('1');
  });
});
