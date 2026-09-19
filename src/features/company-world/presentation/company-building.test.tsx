import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

vi.mock('./three', () => ({
  CompanyWorldView: () => <div data-testid="company-world-view">3D company world</div>,
}));

import { CompanyBuilding } from './company-building';

describe('CompanyBuilding', () => {
  it('renders the real 3D company world', () => {
    render(<CompanyBuilding />);

    expect(
      screen.getByRole('region', {
        name: 'Trinity6 interactive company',
      }),
    ).toBeInTheDocument();

    expect(screen.getByTestId('company-world-view')).toBeInTheDocument();
  });
});
