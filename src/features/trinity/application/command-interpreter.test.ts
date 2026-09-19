import { describe, expect, it } from 'vitest';

import type { TrinityCommand } from '../domain/commands';
import { interpretTrinityCommand } from './command-interpreter';

describe('interpretTrinityCommand', () => {
  it.each([
    {
      command: { type: 'select-entity', entityId: 'server' },
      action: { type: 'select-entity', entityId: 'server' },
    },
    {
      command: { type: 'focus-entity', entityId: 'database' },
      action: { type: 'focus-entity', entityId: 'database' },
    },
    {
      command: { type: 'activate-view', viewId: 'overview' },
      action: { type: 'activate-view', viewId: 'overview' },
    },
    {
      command: {
        type: 'start-experience',
        experienceId: 'walkthrough',
      },
      action: {
        type: 'start-experience',
        experienceId: 'walkthrough',
      },
    },
    {
      command: { type: 'advance-experience' },
      action: { type: 'advance-experience' },
    },
    {
      command: { type: 'previous-experience-step' },
      action: { type: 'previous-experience-step' },
    },
    {
      command: { type: 'stop-experience' },
      action: { type: 'stop-experience' },
    },
  ] satisfies readonly {
    command: TrinityCommand;
    action: object;
  }[])('translates $command.type', ({ command, action }) => {
    expect(interpretTrinityCommand(command)).toEqual(action);
  });
});
