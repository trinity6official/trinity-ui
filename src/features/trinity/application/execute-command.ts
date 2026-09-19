import type { WorldAction } from '@/features/world';

import { interpretTrinityCommand } from './command-interpreter';
import { parseTrinityCommand } from '../domain/command-validation';
import type { TrinityCommand } from '../domain/commands';

export type TrinityCommandExecutionResult =
  | {
      readonly success: true;
      readonly command: TrinityCommand;
      readonly action: WorldAction;
    }
  | {
      readonly success: false;
      readonly error: string;
    };

export function executeTrinityCommand(input: unknown): TrinityCommandExecutionResult {
  const parsed = parseTrinityCommand(input);

  if (!parsed.success) {
    return parsed;
  }

  return {
    success: true,
    command: parsed.command,
    action: interpretTrinityCommand(parsed.command),
  };
}
