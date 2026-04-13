import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Card from '../Card';

describe('Card Component', () => {
  it('renders children correctly', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders title and description when provided', () => {
    render(
      <Card title="Test Title" description="Test Description">
        Content
      </Card>
    );
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders footer when provided', () => {
    const footer = <button>Footer Action</button>;
    render(<Card footer={footer}>Content</Card>);
    expect(screen.getByText('Footer Action')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-class">Content</Card>);
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('does not render header div if title and description are missing', () => {
    const { container } = render(<Card>Content</Card>);
    // The header div has mb-4
    const header = container.querySelector('.mb-4');
    expect(header).toBeNull();
  });

  it('renders header div if only title is provided', () => {
    render(<Card title="Only Title">Content</Card>);
    expect(screen.getByText('Only Title')).toBeInTheDocument();
  });
});
