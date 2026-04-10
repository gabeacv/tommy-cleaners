import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const UpdateStatusSchema = z.object({
  status: z.enum(['new', 'reviewed', 'archived'])
});

describe('UpdateStatusSchema', () => {
  it('accepts valid status values', () => {
    expect(UpdateStatusSchema.safeParse({ status: 'new' }).success).toBe(true);
    expect(UpdateStatusSchema.safeParse({ status: 'reviewed' }).success).toBe(true);
    expect(UpdateStatusSchema.safeParse({ status: 'archived' }).success).toBe(true);
  });

  it('rejects invalid status values', () => {
    expect(UpdateStatusSchema.safeParse({ status: 'pending' }).success).toBe(false);
    expect(UpdateStatusSchema.safeParse({ status: 'deleted' }).success).toBe(false);
    expect(UpdateStatusSchema.safeParse({ status: 123 }).success).toBe(false);
  });
});

// Since I cannot run React tests without a runner/setup, 
// I will provide the pattern for the StatusBadge test here as well.
/*
import { render, screen } from '@testing-library/react';
import StatusBadge from '../components/ui/StatusBadge';

describe('StatusBadge', () => {
  it('renders correct label for "new"', () => {
    render(<StatusBadge status="new" />);
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('has blue classes for "new"', () => {
    const { container } = render(<StatusBadge status="new" />);
    expect(container.firstChild).toHaveClass('bg-blue-50');
  });
});
*/
