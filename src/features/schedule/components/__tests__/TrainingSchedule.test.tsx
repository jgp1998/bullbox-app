import { render, screen, fireEvent, within } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import TrainingSchedule from '../TrainingSchedule';
import { ScheduledSession } from '@/shared/types';

// Mock dependencies
vi.mock('@/shared/context/i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
    language: 'en'
  }),
}));

const mockSessions: ScheduledSession[] = [
  {
    id: '1',
    title: 'Morning Run',
    date: '2024-01-01',
    time: '08:00',
    notes: 'Easy pace'
  },
  {
    id: '2',
    title: 'Afternoon Gym',
    date: '2024-01-01',
    time: '17:00'
  }
];

describe('TrainingSchedule Component', () => {
  const mockOnAdd = vi.fn();
  const mockOnEdit = vi.fn();
  const mockOnDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title and add button', () => {
    render(
      <TrainingSchedule 
        sessions={[]} 
        onAddSession={mockOnAdd} 
        onEditSession={mockOnEdit} 
        onDeleteSession={mockOnDelete} 
      />
    );
    
    expect(screen.getByText('trainingSchedule.title')).toBeInTheDocument();
    expect(screen.getAllByText('trainingSchedule.scheduleButton')[0]).toBeInTheDocument();
  });

  it('renders sessions list correctly', () => {
    render(
      <TrainingSchedule 
        sessions={mockSessions} 
        onAddSession={mockOnAdd} 
        onEditSession={mockOnEdit} 
        onDeleteSession={mockOnDelete} 
      />
    );
    
    expect(screen.getByText('Morning Run')).toBeInTheDocument();
    expect(screen.getByText('Afternoon Gym')).toBeInTheDocument();
    expect(screen.getByText(/Easy pace/i)).toBeInTheDocument();
  });

  it('shows empty state when no sessions', () => {
    render(
      <TrainingSchedule 
        sessions={[]} 
        onAddSession={mockOnAdd} 
        onEditSession={mockOnEdit} 
        onDeleteSession={mockOnDelete} 
      />
    );
    
    expect(screen.getByText('trainingSchedule.noSessions')).toBeInTheDocument();
  });

  it('calls onAddSession when add button is clicked', () => {
    render(
      <TrainingSchedule 
        sessions={[]} 
        onAddSession={mockOnAdd} 
        onEditSession={mockOnEdit} 
        onDeleteSession={mockOnDelete} 
      />
    );
    
    // There are two "scheduleButton" strings when empty (header and empty state)
    const addButtons = screen.getAllByText('trainingSchedule.scheduleButton');
    fireEvent.click(addButtons[0]);
    expect(mockOnAdd).toHaveBeenCalledTimes(1);
  });

  it('calls onEditSession when edit icon is clicked', () => {
    render(
      <TrainingSchedule 
        sessions={mockSessions} 
        onAddSession={mockOnAdd} 
        onEditSession={mockOnEdit} 
        onDeleteSession={mockOnDelete} 
      />
    );
    
    const editButtons = screen.getAllByTitle('trainingSchedule.editSession');
    fireEvent.click(editButtons[0]);
    expect(mockOnEdit).toHaveBeenCalledWith(mockSessions[0]);
  });

  it('opens confirm modal when delete icon is clicked', () => {
    render(
      <TrainingSchedule 
        sessions={mockSessions} 
        onAddSession={mockOnAdd} 
        onEditSession={mockOnEdit} 
        onDeleteSession={mockOnDelete} 
      />
    );
    
    const deleteButtons = screen.getAllByTitle('trainingSchedule.deleteSession');
    fireEvent.click(deleteButtons[0]);
    
    expect(screen.getByText('modals.confirmDeleteTitle')).toBeInTheDocument();
  });

  it('calls onDeleteSession when confirmed in modal', () => {
    render(
      <TrainingSchedule 
        sessions={mockSessions} 
        onAddSession={mockOnAdd} 
        onEditSession={mockOnEdit} 
        onDeleteSession={mockOnDelete} 
      />
    );
    
    // Open modal
    const deleteButtons = screen.getAllByTitle('trainingSchedule.deleteSession');
    fireEvent.click(deleteButtons[0]);
    
    // Click confirm in modal
    // ConfirmModal uses "common.confirm" or similar for button text? No, it uses title/message props.
    // Let's assume ConfirmModal has a button with text "Confirm" (or mocked t key)
    const confirmButton = screen.getByText('common.confirm');
    fireEvent.click(confirmButton);
    
    expect(mockOnDelete).toHaveBeenCalledWith(mockSessions[0].id);
  });
});
