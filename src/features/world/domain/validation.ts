import type { WorldId, WorldScene } from './types';

export interface WorldValidationIssue {
  readonly code:
    | 'duplicate-id'
    | 'missing-entity'
    | 'missing-relationship'
    | 'duplicate-experience-step-id';
  readonly path: string;
  readonly message: string;
}

export interface WorldValidationResult {
  readonly valid: boolean;
  readonly issues: readonly WorldValidationIssue[];
}

function findDuplicates(ids: readonly WorldId[]): readonly WorldId[] {
  const seen = new Set<WorldId>();
  const duplicates = new Set<WorldId>();

  for (const id of ids) {
    if (seen.has(id)) {
      duplicates.add(id);
    }

    seen.add(id);
  }

  return [...duplicates];
}

export function validateWorldScene(scene: WorldScene): WorldValidationResult {
  const issues: WorldValidationIssue[] = [];
  const entityIds = new Set(scene.entities.map((entity) => entity.id));
  const relationshipIds = new Set(scene.relationships.map((relationship) => relationship.id));

  const topLevelIds = [
    scene.id,
    ...scene.entities.map((entity) => entity.id),
    ...scene.relationships.map((relationship) => relationship.id),
    ...scene.hotspots.map((hotspot) => hotspot.id),
    ...scene.views.map((view) => view.id),
    ...scene.experiences.map((experience) => experience.id),
  ];

  for (const id of findDuplicates(topLevelIds)) {
    issues.push({
      code: 'duplicate-id',
      path: scene.id,
      message: `World ID "${id}" is used more than once.`,
    });
  }

  for (const relationship of scene.relationships) {
    if (!entityIds.has(relationship.sourceEntityId)) {
      issues.push({
        code: 'missing-entity',
        path: `relationships.${relationship.id}.sourceEntityId`,
        message: `Relationship "${relationship.id}" references missing source entity "${relationship.sourceEntityId}".`,
      });
    }

    if (!entityIds.has(relationship.targetEntityId)) {
      issues.push({
        code: 'missing-entity',
        path: `relationships.${relationship.id}.targetEntityId`,
        message: `Relationship "${relationship.id}" references missing target entity "${relationship.targetEntityId}".`,
      });
    }
  }

  for (const hotspot of scene.hotspots) {
    if (!entityIds.has(hotspot.entityId)) {
      issues.push({
        code: 'missing-entity',
        path: `hotspots.${hotspot.id}.entityId`,
        message: `Hotspot "${hotspot.id}" references missing entity "${hotspot.entityId}".`,
      });
    }
  }

  for (const view of scene.views) {
    for (const entityId of view.entityIds) {
      if (!entityIds.has(entityId)) {
        issues.push({
          code: 'missing-entity',
          path: `views.${view.id}.entityIds`,
          message: `View "${view.id}" references missing entity "${entityId}".`,
        });
      }
    }
  }

  for (const experience of scene.experiences) {
    for (const stepId of findDuplicates(experience.steps.map((step) => step.id))) {
      issues.push({
        code: 'duplicate-experience-step-id',
        path: `experiences.${experience.id}.steps`,
        message: `Experience "${experience.id}" uses step ID "${stepId}" more than once.`,
      });
    }

    for (const step of experience.steps) {
      for (const entityId of step.entityIds ?? []) {
        if (!entityIds.has(entityId)) {
          issues.push({
            code: 'missing-entity',
            path: `experiences.${experience.id}.steps.${step.id}.entityIds`,
            message: `Experience step "${step.id}" references missing entity "${entityId}".`,
          });
        }
      }

      for (const relationshipId of step.relationshipIds ?? []) {
        if (!relationshipIds.has(relationshipId)) {
          issues.push({
            code: 'missing-relationship',
            path: `experiences.${experience.id}.steps.${step.id}.relationshipIds`,
            message: `Experience step "${step.id}" references missing relationship "${relationshipId}".`,
          });
        }
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
  };
}

export function assertValidWorldScene(scene: WorldScene): void {
  const result = validateWorldScene(scene);

  if (!result.valid) {
    throw new Error(result.issues.map((issue) => issue.message).join('\n'));
  }
}
