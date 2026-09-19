import type { WorldAction } from '@/features/world';

import type { TrinityCommand } from '../domain/commands';

export function interpretTrinityCommand(command: TrinityCommand): WorldAction {
  switch (command.type) {
    case 'select-entity':
      return {
        type: 'select-entity',
        entityId: command.entityId,
      };

    case 'focus-entity':
      return {
        type: 'focus-entity',
        entityId: command.entityId,
      };

    case 'activate-view':
      return {
        type: 'activate-view',
        viewId: command.viewId,
      };

    case 'start-experience':
      return {
        type: 'start-experience',
        experienceId: command.experienceId,
      };

    case 'advance-experience':
      return {
        type: 'advance-experience',
      };

    case 'previous-experience-step':
      return {
        type: 'previous-experience-step',
      };

    case 'stop-experience':
      return {
        type: 'stop-experience',
      };
  }
}
