import { describe, expect, it } from 'vitest';

import type { WorldRelationship } from '@/features/world';

import { createRelationshipLines } from './relationship-geometry';

const relationship: WorldRelationship = {
  id: 'a-to-b',
  type: 'connects-to',
  sourceEntityId: 'a',
  targetEntityId: 'b',
};

describe('createRelationshipLines', () => {
  it('creates line geometry from entity positions', () => {
    expect(
      createRelationshipLines([relationship], {
        a: { x: 10, y: 20 },
        b: { x: 70, y: 80 },
      }),
    ).toEqual([
      {
        id: 'a-to-b',
        sourceEntityId: 'a',
        targetEntityId: 'b',
        x1: 10,
        y1: 20,
        x2: 70,
        y2: 80,
      },
    ]);
  });

  it('omits relationships whose positions cannot be rendered', () => {
    expect(
      createRelationshipLines([relationship], {
        a: { x: 10, y: 20 },
      }),
    ).toEqual([]);
  });
});
