import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import PercentageCalculator from './index';
import { useI18n } from '@/context/i18n';

// Mock dependencies
vi.mock('@/context/i18n', () => ({
  useI18n: vi.fn(),
}));

// Mock PlateBreakdown as it's complex and tested elsewhere
vi.mock('@/src/shared/components/calculators/PlateBreakdown', () => ({
  default: () => <div data-testid="plate-breakdown">Plate Breakdown</div>,
}));

// Setup default mock for i18n
const mockT = vi.fn((key: string) => key);
(useI18n as any).mockReturnValue({
  t: mockT,
});

describe('PercentageCalculator', () => {
  const mockUser: any = {
    id: 'user1',
    name: 'Test User',
    gender: 'Male',
  };

  const mockRecords: any[] = [
    {
      id: '1',
      exercise: 'Back Squat',
      weight: 100,
      reps: 5,
      unit: 'kg',
      date: '2023-01-01',
    },
    {
        id: '2',
        exercise: 'Deadlift',
        weight: 150,
        reps: 1,
        unit: 'kg',
        date: '2023-01-01',
      },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (useI18n as any).mockReturnValue({
        t: mockT,
      });
  });

  it('renders the component with exercise selection', () => {
    render(<PercentageCalculator records={mockRecords} user={mockUser} />);
    
    expect(screen.getByText('percentageCalculator.title')).toBeInTheDocument();
    expect(screen.getByText('percentageCalculator.exerciseLabel')).toBeInTheDocument();
    
    // Check if both exercises are in the dropdown
    const select = screen.getByDisplayValue('Back Squat');
    expect(select).toBeInTheDocument();
  });

  it('calculates 1RM and percentage when clicking calculate', () => {
    render(<PercentageCalculator records={mockRecords} user={mockUser} />);
    
    // Set percentage to 90%
    const percentageInput = screen.getByPlaceholderText('e.g., 80');
    fireEvent.change(percentageInput, { target: { value: '90' } });
    
    // Click calculate
    const calculateButton = screen.getByText('percentageCalculator.calculate');
    fireEvent.click(calculateButton);
    
    // For Back Squat (100kg @ 5 reps):
    // 1RM = 100 * (1 + 5/30) = 116.66...
    // 90% of 116.66... = 105
    
    expect(screen.getByText('105.0')).toBeInTheDocument();
    expect(screen.getByTestId('plate-breakdown')).toBeInTheDocument();
  });

  it('switches between KG and LBS plates', () => {
    render(<PercentageCalculator records={mockRecords} user={mockUser} />);
    
    fireEvent.click(screen.getByText('percentageCalculator.calculate'));
    
    // Default is KG
    const kgButton = screen.getAllByRole('button').find(b => b.textContent === 'kg');
    expect(kgButton).toHaveClass('bg-[var(--primary)]');
    
    // Click LBS
    const lbsButton = screen.getAllByRole('button').find(b => b.textContent === 'lbs');
    if (lbsButton) fireEvent.click(lbsButton);
    
    expect(lbsButton).toHaveClass('bg-[var(--primary)]');
  });

  it('shows empty state if no records are provided', () => {
    render(<PercentageCalculator records={[]} user={mockUser} />);
    
    expect(screen.getByText('percentageCalculator.noPBs')).toBeInTheDocument();
    expect(screen.getByText('percentageCalculator.calculate')).toBeDisabled();
  });

  it('updates result when exercise is changed', () => {
    render(<PercentageCalculator records={mockRecords} user={mockUser} />);
    
    // Change to Deadlift (150kg @ 1 rep -> 1RM = 150)
    const select = screen.getByLabelText(/percentageCalculator.exerciseLabel/i);
    fireEvent.change(select, { target: { value: 'Deadlift' } });
    
    // Set 100%
    const percentageInput = screen.getByPlaceholderText('e.g., 80');
    fireEvent.change(percentageInput, { target: { value: '100' } });
    
    fireEvent.click(screen.getByText('percentageCalculator.calculate'));
    
    expect(screen.getByText('150.0')).toBeInTheDocument();
  });
});
