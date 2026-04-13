import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Alert from '../Alert';

describe('Alert Component', () => {
  it('renders message correctly', () => {
    render(<Alert message="Test message" />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Alert title="Test Title" message="Test message" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('applies variant classes correctly', () => {
    const { rerender } = render(<Alert message="Info" variant="info" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-blue-500/10');

    rerender(<Alert message="Error" variant="error" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-red-500/10');

    rerender(<Alert message="Warning" variant="warning" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-yellow-500/10');

    rerender(<Alert message="Success" variant="success" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-green-500/10');
  });

  it('applies custom className', () => {
    render(<Alert message="Test" className="custom-class" />);
    expect(screen.getByRole('alert')).toHaveClass('custom-class');
  });

  it('has role="alert"', () => {
    render(<Alert message="Test" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
