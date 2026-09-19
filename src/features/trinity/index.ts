export {
  executeTrinityCommand,
  type TrinityCommandExecutionResult,
} from './application/execute-command';

export { interpretTrinityCommand } from './application/command-interpreter';

export { parseTrinityCommand, type TrinityCommandParseResult } from './domain/command-validation';

export type { TrinityCommand } from './domain/commands';
