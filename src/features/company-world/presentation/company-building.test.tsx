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

  it('runs a guided experience through the company environment', () => {
    render(<CompanyBuilding />);

    fireEvent.click(screen.getByRole('button', { name: 'How a company gets hacked' }));

    expect(screen.getByText('Step 1 of 6')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '1. It often starts with a person' }),
    ).toBeInTheDocument();

    const employee = screen.getByRole('button', { name: 'Employee' });
    expect(employee).toHaveClass('isHighlighted');

    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByText('Step 2 of 6')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '2. The endpoint becomes the foothold' }),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Previous' }));

    expect(screen.getByText('Step 1 of 6')).toBeInTheDocument();
  });

  it('can exit a guided experience', () => {
    render(<CompanyBuilding />);

    fireEvent.click(screen.getByRole('button', { name: 'How a company gets hacked' }));
    fireEvent.click(screen.getByRole('button', { name: 'Exit' }));

    expect(screen.getByRole('button', { name: 'How a company gets hacked' })).toBeInTheDocument();
  });

  it('starts the guided experience through the Trinity command boundary', () => {
    render(<CompanyBuilding />);

    fireEvent.click(screen.getByRole('button', { name: 'How a company gets hacked' }));

    expect(screen.getByText('Step 1 of 6')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: '1. It often starts with a person' }),
    ).toBeInTheDocument();
  });
});
