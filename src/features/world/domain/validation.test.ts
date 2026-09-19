import { describe, expect, it } from 'vitest';

import type { WorldScene } from './types';
import { validateWorldScene } from './validation';

const validScene: WorldScene = {
  id: 'scene-1',
  label: 'Example world',
  entities: [
    { id: 'entity-a', type: 'example', label: 'Entity A' },
    { id: 'entity-b', type: 'example', label: 'Entity B' },
  ],
  relationships: [
    {
      id: 'relationship-a-b',
      type: 'connects-to',
      sourceEntityId: 'entity-a',
      targetEntityId: 'entity-b',
    },
  ],
  hotspots: [{ id: 'hotspot-a', entityId: 'entity-a', label: 'Inspect A' }],
  views: [{ id: 'view-main', label: 'Main', entityIds: ['entity-a', 'entity-b'] }],
  experiences: [
    {
      id: 'experience-1',
      title: 'Example experience',
      steps: [
        {
          id: 'step-1',
          title: 'Inspect the relationship',
          entityIds: ['entity-a'],
          relationshipIds: ['relationship-a-b'],
        },
      ],
    },
  ],
};

describe('validateWorldScene', () => {
  it('accepts a structurally valid scene', () => {
    expect(validateWorldScene(validScene)).toEqual({
      valid: true,
      issues: [],
    });
  });

  it('rejects relationships that reference missing entities', () => {
    const scene: WorldScene = {
      ...validScene,
      relationships: [
        {
          id: 'broken-relationship',
          type: 'connects-to',
          sourceEntityId: 'entity-a',
          targetEntityId: 'missing',
        },
      ],
      experiences: [],
    };

    const result = validateWorldScene(scene);

    expect(result.valid).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'missing-entity',
          path: 'relationships.broken-relationship.targetEntityId',
        }),
      ]),
    );
  });

  it('rejects duplicate IDs across top-level world objects', () => {
    const scene: WorldScene = {
      ...validScene,
      views: [{ id: 'entity-a', label: 'Duplicate', entityIds: [] }],
    };

    const result = validateWorldScene(scene);

    expect(result.valid).toBe(false);
    expect(result.issues).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'duplicate-id',
        }),
      ]),
    );
  });

  it('validates references used by experience steps', () => {
    const scene: WorldScene = {
      ...validScene,
      experiences: [
        {
          id: 'experience-broken',
          title: 'Broken',
          steps: [
            {
              id: 'step-broken',
              title: 'Broken step',
              entityIds: ['missing-entity'],
              relationshipIds: ['missing-relationship'],
            },
          ],
        },
      ],
    };

    const result = validateWorldScene(scene);

    expect(result.valid).toBe(false);
    expect(result.issues.map((issue) => issue.code)).toEqual(
      expect.arrayContaining(['missing-entity', 'missing-relationship']),
    );
  });
});
