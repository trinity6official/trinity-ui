import type { WorldId } from '@/features/world';

export type TrinityCommand =
  | {
      readonly type: 'select-entity';
      readonly entityId: WorldId | null;
    }
  | {
      readonly type: 'focus-entity';
      readonly entityId: WorldId | null;
    }
  | {
      readonly type: 'activate-view';
      readonly viewId: WorldId | null;
    }
  | {
      readonly type: 'start-experience';
      readonly experienceId: WorldId;
    }
  | {
      readonly type: 'advance-experience';
    }
  | {
      readonly type: 'previous-experience-step';
    }
  | {
      readonly type: 'stop-experience';
    };
