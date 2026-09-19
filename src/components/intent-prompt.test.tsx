import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { IntentPrompt } from './intent-prompt';

describe('IntentPrompt', () => {
  it('keeps the foundation interaction local and transparent', () => {
    render(<IntentPrompt />);
    const input = screen.getByLabelText('What do you want to do?');
    fireEvent.change(input, { target: { value: 'Show me how ransomware works' } });
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }));
    expect(
      screen.getByText(/interactive world and Trinity connection arrive in later phases/i),
    ).toBeInTheDocument();
  });
});
