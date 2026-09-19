import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { CompanyBuilding } from './company-building';

describe('CompanyBuilding', () => {
  it('lets a user inspect a company entity', () => {
    render(<CompanyBuilding />);

    fireEvent.click(screen.getByRole('button', { name: 'Application Server' }));

    expect(screen.getByRole('heading', { name: 'Application Server' })).toBeInTheDocument();
    expect(screen.getByText('reads from → Database')).toBeInTheDocument();
    expect(screen.getByText('connects to → Cloud Service')).toBeInTheDocument();
  });

  it('can clear the selected entity', () => {
    render(<CompanyBuilding />);

    fireEvent.click(screen.getByRole('button', { name: 'Firewall' }));
    fireEvent.click(screen.getByRole('button', { name: 'Close details' }));

    expect(
      screen.getByRole('heading', { name: 'Select something in the company.' }),
    ).toBeInTheDocument();
  });
});
