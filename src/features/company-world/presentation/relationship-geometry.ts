import type { WorldRelationship } from '@/features/world';

export interface EntityPoint {
  readonly x: number;
  readonly y: number;
}

export interface RelationshipLine {
  readonly id: string;
  readonly sourceEntityId: string;
  readonly targetEntityId: string;
  readonly x1: number;
  readonly y1: number;
  readonly x2: number;
  readonly y2: number;
}

export function createRelationshipLines(
  relationships: readonly WorldRelationship[],
  positions: Readonly<Record<string, EntityPoint>>,
): readonly RelationshipLine[] {
  return relationships.flatMap((relationship) => {
    const source = positions[relationship.sourceEntityId];
    const target = positions[relationship.targetEntityId];

    if (!source || !target) {
      return [];
    }

    return [
      {
        id: relationship.id,
        sourceEntityId: relationship.sourceEntityId,
        targetEntityId: relationship.targetEntityId,
        x1: source.x,
        y1: source.y,
        x2: target.x,
        y2: target.y,
      },
    ];
  });
}
