import type { TrinityCommand } from './commands';

export type TrinityCommandParseResult =
  | {
      readonly success: true;
      readonly command: TrinityCommand;
    }
  | {
      readonly success: false;
      readonly error: string;
    };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function hasOnlyKeys(value: Record<string, unknown>, keys: readonly string[]): boolean {
  const allowedKeys = new Set(keys);

  return Object.keys(value).every((key) => allowedKeys.has(key));
}

function isNullableString(value: unknown): value is string | null {
  return typeof value === 'string' || value === null;
}

export function parseTrinityCommand(value: unknown): TrinityCommandParseResult {
  if (!isRecord(value)) {
    return {
      success: false,
      error: 'Trinity command must be an object.',
    };
  }

  if (typeof value.type !== 'string') {
    return {
      success: false,
      error: 'Trinity command must include a string type.',
    };
  }

  switch (value.type) {
    case 'select-entity':
    case 'focus-entity':
      if (!hasOnlyKeys(value, ['type', 'entityId']) || !isNullableString(value.entityId)) {
        return {
          success: false,
          error: `${value.type} requires only an entityId string or null.`,
        };
      }

      return {
        success: true,
        command: {
          type: value.type,
          entityId: value.entityId,
        },
      };

    case 'activate-view':
      if (!hasOnlyKeys(value, ['type', 'viewId']) || !isNullableString(value.viewId)) {
        return {
          success: false,
          error: 'activate-view requires only a viewId string or null.',
        };
      }

      return {
        success: true,
        command: {
          type: 'activate-view',
          viewId: value.viewId,
        },
      };

    case 'start-experience':
      if (!hasOnlyKeys(value, ['type', 'experienceId']) || typeof value.experienceId !== 'string') {
        return {
          success: false,
          error: 'start-experience requires only an experienceId string.',
        };
      }

      return {
        success: true,
        command: {
          type: 'start-experience',
          experienceId: value.experienceId,
        },
      };

    case 'advance-experience':
    case 'previous-experience-step':
    case 'stop-experience':
      if (!hasOnlyKeys(value, ['type'])) {
        return {
          success: false,
          error: `${value.type} does not accept additional fields.`,
        };
      }

      return {
        success: true,
        command: {
          type: value.type,
        },
      };

    default:
      return {
        success: false,
        error: `Unsupported Trinity command type "${value.type}".`,
      };
  }
}
