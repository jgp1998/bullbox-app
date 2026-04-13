import { render, screen, act, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Toast from '../Toast';

describe('Toast', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the message correctly', () => {
    render(<Toast id="1" message="Success message" onClose={() => {}} />);
    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('calls onClose after the duration', () => {
    const onClose = vi.fn();
    render(<Toast id="1" message="Test" duration={3000} onClose={onClose} />);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    // Handle the 300ms exit animation
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onClose).toHaveBeenCalledWith('1');
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<Toast id="1" message="Test" onClose={onClose} />);

    fireEvent.click(screen.getByLabelText('Close'));

    // Handle the 300ms exit animation
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(onClose).toHaveBeenCalledWith('1');
  });

  it('renders different variants correctly', () => {
    const { rerender } = render(<Toast id="1" message="Error" variant="error" onClose={() => {}} />);
    let toast = screen.getByRole('alert');
    expect(toast).toHaveClass('text-red-500');

    rerender(<Toast id="2" message="Warning" variant="warning" onClose={() => {}} />);
    toast = screen.getByRole('alert');
    expect(toast).toHaveClass('text-yellow-500');
  });
});
