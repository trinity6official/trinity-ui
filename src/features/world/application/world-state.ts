import type { WorldId, WorldScene } from '../domain/types';
import { assertValidWorldScene } from '../domain/validation';

export interface WorldState {
  readonly scene: WorldScene;
  readonly selectedEntityId: WorldId | null;
  readonly focusedEntityId: WorldId | null;
  readonly activeViewId: WorldId | null;
  readonly activeExperienceId: WorldId | null;
  readonly activeExperienceStepIndex: number | null;
}

export type WorldAction =
  | { readonly type: 'select-entity'; readonly entityId: WorldId | null }
  | { readonly type: 'focus-entity'; readonly entityId: WorldId | null }
  | { readonly type: 'activate-view'; readonly viewId: WorldId | null }
  | { readonly type: 'start-experience'; readonly experienceId: WorldId }
  | { readonly type: 'advance-experience' }
  | { readonly type: 'stop-experience' };

export function createWorldState(scene: WorldScene): WorldState {
  assertValidWorldScene(scene);

  return {
    scene,
    selectedEntityId: null,
    focusedEntityId: null,
    activeViewId: null,
    activeExperienceId: null,
    activeExperienceStepIndex: null,
  };
}

function entityExists(scene: WorldScene, entityId: WorldId): boolean {
  return scene.entities.some((entity) => entity.id === entityId);
}

function viewExists(scene: WorldScene, viewId: WorldId): boolean {
  return scene.views.some((view) => view.id === viewId);
}

export function reduceWorldState(state: WorldState, action: WorldAction): WorldState {
  switch (action.type) {
    case 'select-entity':
      if (action.entityId !== null && !entityExists(state.scene, action.entityId)) {
        return state;
      }

      return {
        ...state,
        selectedEntityId: action.entityId,
      };

    case 'focus-entity':
      if (action.entityId !== null && !entityExists(state.scene, action.entityId)) {
        return state;
      }

      return {
        ...state,
        focusedEntityId: action.entityId,
      };

    case 'activate-view':
      if (action.viewId !== null && !viewExists(state.scene, action.viewId)) {
        return state;
      }

      return {
        ...state,
        activeViewId: action.viewId,
      };

    case 'start-experience': {
      const experience = state.scene.experiences.find(
        (candidate) => candidate.id === action.experienceId,
      );

      if (!experience || experience.steps.length === 0) {
        return state;
      }

      return {
        ...state,
        activeExperienceId: experience.id,
        activeExperienceStepIndex: 0,
      };
    }

    case 'advance-experience': {
      if (state.activeExperienceId === null || state.activeExperienceStepIndex === null) {
        return state;
      }

      const experience = state.scene.experiences.find(
        (candidate) => candidate.id === state.activeExperienceId,
      );

      if (!experience) {
        return state;
      }

      const nextIndex = state.activeExperienceStepIndex + 1;

      if (nextIndex >= experience.steps.length) {
        return {
          ...state,
          activeExperienceId: null,
          activeExperienceStepIndex: null,
        };
      }

      return {
        ...state,
        activeExperienceStepIndex: nextIndex,
      };
    }

    case 'stop-experience':
      return {
        ...state,
        activeExperienceId: null,
        activeExperienceStepIndex: null,
      };
  }
}
