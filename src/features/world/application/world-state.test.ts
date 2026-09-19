import { describe, expect, it } from 'vitest';

import type { WorldScene } from '../domain/types';
import { createWorldState, reduceWorldState } from './world-state';

const scene: WorldScene = {
  id: 'scene',
  label: 'Scene',
  entities: [{ id: 'server', type: 'example', label: 'Server' }],
  relationships: [],
  hotspots: [],
  views: [{ id: 'overview', label: 'Overview', entityIds: ['server'] }],
  experiences: [
    {
      id: 'walkthrough',
      title: 'Walkthrough',
      steps: [
        { id: 'first', title: 'First' },
        { id: 'second', title: 'Second' },
      ],
    },
  ],
};

describe('world state', () => {
  it('rejects an invalid scene at the application boundary', () => {
    const invalidScene: WorldScene = {
      ...scene,
      relationships: [
        {
          id: 'broken',
          type: 'connects-to',
          sourceEntityId: 'server',
          targetEntityId: 'missing',
        },
      ],
    };

    expect(() => createWorldState(invalidScene)).toThrow(
      'references missing target entity "missing"',
    );
  });

  it('starts without UI selections', () => {
    expect(createWorldState(scene)).toMatchObject({
      selectedEntityId: null,
      focusedEntityId: null,
      activeViewId: null,
      activeExperienceId: null,
      activeExperienceStepIndex: null,
    });
  });

  it('selects and focuses known entities', () => {
    const initial = createWorldState(scene);
    const selected = reduceWorldState(initial, {
      type: 'select-entity',
      entityId: 'server',
    });
    const focused = reduceWorldState(selected, {
      type: 'focus-entity',
      entityId: 'server',
    });

    expect(focused.selectedEntityId).toBe('server');
    expect(focused.focusedEntityId).toBe('server');
  });

  it('ignores references to unknown entities', () => {
    const initial = createWorldState(scene);

    expect(
      reduceWorldState(initial, {
        type: 'select-entity',
        entityId: 'missing',
      }),
    ).toBe(initial);
  });

  it('advances and completes an experience', () => {
    const initial = createWorldState(scene);
    const started = reduceWorldState(initial, {
      type: 'start-experience',
      experienceId: 'walkthrough',
    });
    const advanced = reduceWorldState(started, {
      type: 'advance-experience',
    });
    const completed = reduceWorldState(advanced, {
      type: 'advance-experience',
    });

    expect(started.activeExperienceStepIndex).toBe(0);
    expect(advanced.activeExperienceStepIndex).toBe(1);
    expect(completed.activeExperienceId).toBeNull();
    expect(completed.activeExperienceStepIndex).toBeNull();
  });
});
