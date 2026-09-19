export type WorldId = string;

export interface WorldEntity {
  readonly id: WorldId;
  readonly type: string;
  readonly label: string;
  readonly description?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface WorldRelationship {
  readonly id: WorldId;
  readonly type: string;
  readonly sourceEntityId: WorldId;
  readonly targetEntityId: WorldId;
  readonly label?: string;
  readonly metadata?: Readonly<Record<string, unknown>>;
}

export interface WorldHotspot {
  readonly id: WorldId;
  readonly entityId: WorldId;
  readonly label: string;
  readonly description?: string;
}

export interface WorldView {
  readonly id: WorldId;
  readonly label: string;
  readonly entityIds: readonly WorldId[];
}

export interface ExperienceStep {
  readonly id: WorldId;
  readonly title: string;
  readonly description?: string;
  readonly entityIds?: readonly WorldId[];
  readonly relationshipIds?: readonly WorldId[];
}

export interface WorldExperience {
  readonly id: WorldId;
  readonly title: string;
  readonly description?: string;
  readonly steps: readonly ExperienceStep[];
}

export interface WorldScene {
  readonly id: WorldId;
  readonly label: string;
  readonly entities: readonly WorldEntity[];
  readonly relationships: readonly WorldRelationship[];
  readonly hotspots: readonly WorldHotspot[];
  readonly views: readonly WorldView[];
  readonly experiences: readonly WorldExperience[];
}
