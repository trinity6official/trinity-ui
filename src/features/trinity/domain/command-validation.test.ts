import { describe, expect, it } from 'vitest';

import { parseTrinityCommand } from './command-validation';

describe('parseTrinityCommand', () => {
  it('accepts a valid entity command', () => {
    expect(
      parseTrinityCommand({
        type: 'focus-entity',
        entityId: 'server',
      }),
    ).toEqual({
      success: true,
      command: {
        type: 'focus-entity',
        entityId: 'server',
      },
    });
  });

  it('accepts a valid experience command', () => {
    expect(
      parseTrinityCommand({
        type: 'start-experience',
        experienceId: 'company-attack-path',
      }),
    ).toEqual({
      success: true,
      command: {
        type: 'start-experience',
        experienceId: 'company-attack-path',
      },
    });
  });

  it('rejects unknown command types', () => {
    expect(
      parseTrinityCommand({
        type: 'delete-world',
      }),
    ).toEqual({
      success: false,
      error: 'Unsupported Trinity command type "delete-world".',
    });
  });

  it('rejects malformed command payloads', () => {
    expect(
      parseTrinityCommand({
        type: 'focus-entity',
        entityId: 42,
      }),
    ).toEqual({
      success: false,
      error: 'focus-entity requires only an entityId string or null.',
    });
  });

  it('rejects unexpected command fields', () => {
    expect(
      parseTrinityCommand({
        type: 'advance-experience',
        arbitrary: true,
      }),
    ).toEqual({
      success: false,
      error: 'advance-experience does not accept additional fields.',
    });
  });
});
