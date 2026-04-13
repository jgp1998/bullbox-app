import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ConfirmModal from '../ConfirmModal';

// Mock useI18n
vi.mock('@/shared/context/i18n', () => ({
  useI18n: () => ({
    t: (key: string) => key,
  }),
}));

describe('ConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onConfirm: vi.fn(),
    title: 'Confirm Title',
    message: 'Are you sure?',
  };

  it('renders correctly when open', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('Confirm Title')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('common.cancel')).toBeInTheDocument();
    expect(screen.getByText('common.confirm')).toBeInTheDocument();
  });

  it('calls onConfirm and onClose when confirm button is clicked', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText('common.confirm'));
    expect(defaultProps.onConfirm).toHaveBeenCalled();
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('calls onClose when cancel button is clicked', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText('common.cancel'));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('does not render when closed', () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Confirm Title')).not.toBeInTheDocument();
  });

  it('uses custom confirm/cancel text if provided', () => {
    render(
      <ConfirmModal
        {...defaultProps}
        confirmText="Yes, delete"
        cancelText="No, keep it"
      />
    );
    expect(screen.getByText('Yes, delete')).toBeInTheDocument();
    expect(screen.getByText('No, keep it')).toBeInTheDocument();
  });
});
