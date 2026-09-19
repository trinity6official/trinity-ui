import { describe, expect, it } from 'vitest';

import { executeTrinityCommand } from './execute-command';

describe('executeTrinityCommand', () => {
  it('validates and translates an external command', () => {
    expect(
      executeTrinityCommand({
        type: 'select-entity',
        entityId: 'server',
      }),
    ).toEqual({
      success: true,
      command: {
        type: 'select-entity',
        entityId: 'server',
      },
      action: {
        type: 'select-entity',
        entityId: 'server',
      },
    });
  });

  it('supports experience navigation commands', () => {
    expect(
      executeTrinityCommand({
        type: 'advance-experience',
      }),
    ).toEqual({
      success: true,
      command: {
        type: 'advance-experience',
      },
      action: {
        type: 'advance-experience',
      },
    });
  });

  it('fails closed when external input is invalid', () => {
    expect(
      executeTrinityCommand({
        type: 'select-entity',
        entityId: 42,
      }),
    ).toEqual({
      success: false,
      error: 'select-entity requires only an entityId string or null.',
    });
  });

  it('does not interpret unsupported commands', () => {
    expect(
      executeTrinityCommand({
        type: 'destroy-scene',
      }),
    ).toEqual({
      success: false,
      error: 'Unsupported Trinity command type "destroy-scene".',
    });
  });
});
