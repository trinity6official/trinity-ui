'use client';

import { useMemo, useReducer } from 'react';

import {
  createWorldState,
  reduceWorldState,
  type WorldEntity,
  type WorldRelationship,
} from '@/features/world';

import { companyScene } from '../content/company-scene';

interface EntityPosition {
  readonly left: string;
  readonly top: string;
}

const positions: Readonly<Record<string, EntityPosition>> = {
  employee: { left: '11%', top: '20%' },
  laptop: { left: '27%', top: '31%' },
  wifi: { left: '43%', top: '20%' },
  firewall: { left: '58%', top: '38%' },
  server: { left: '72%', top: '28%' },
  database: { left: '81%', top: '59%' },
  cloud: { left: '70%', top: '7%' },
  cctv: { left: '15%', top: '65%' },
  access: { left: '34%', top: '70%' },
};

function relationshipText(relationship: WorldRelationship, selectedEntity: WorldEntity): string {
  const otherEntityId =
    relationship.sourceEntityId === selectedEntity.id
      ? relationship.targetEntityId
      : relationship.sourceEntityId;

  const otherEntity = companyScene.entities.find((entity) => entity.id === otherEntityId);

  if (!otherEntity) {
    return relationship.label ?? relationship.type;
  }

  if (relationship.sourceEntityId === selectedEntity.id) {
    return `${relationship.label ?? relationship.type} → ${otherEntity.label}`;
  }

  return `${otherEntity.label} → ${relationship.label ?? relationship.type}`;
}

export function CompanyBuilding() {
  const [state, dispatch] = useReducer(reduceWorldState, companyScene, createWorldState);

  const selectedEntity = useMemo(
    () =>
      state.selectedEntityId
        ? (companyScene.entities.find((entity) => entity.id === state.selectedEntityId) ?? null)
        : null,
    [state.selectedEntityId],
  );

  const relationships = useMemo(() => {
    if (!selectedEntity) {
      return [];
    }

    return companyScene.relationships.filter(
      (relationship) =>
        relationship.sourceEntityId === selectedEntity.id ||
        relationship.targetEntityId === selectedEntity.id,
    );
  }, [selectedEntity]);

  return (
    <section className="companyExperience" aria-labelledby="company-world-title">
      <div className="companyExperienceHeader">
        <div>
          <p className="eyebrow">World 01 · Company</p>
          <h2 id="company-world-title">Explore how a digital company works.</h2>
          <p>
            Select a system to understand what it does and how it connects to the rest of the
            environment.
          </p>
        </div>

        <p className="companyHint">Tap or use Tab + Enter to inspect an object.</p>
      </div>

      <div className="companyWorkspace">
        <div className="companyBuilding" role="group" aria-label="Interactive company environment">
          <div className="buildingTop">
            <span>TRINITY6</span>
            <span>COMPANY ENVIRONMENT</span>
          </div>

          <div className="buildingGrid" aria-hidden="true">
            <div>OFFICE</div>
            <div>NETWORK</div>
            <div>SERVER ROOM</div>
            <div>PHYSICAL SECURITY</div>
          </div>

          {companyScene.entities.map((entity) => {
            const position = positions[entity.id];

            if (!position) {
              return null;
            }

            const selected = entity.id === state.selectedEntityId;

            return (
              <button
                key={entity.id}
                type="button"
                className={`worldEntity worldEntity--${entity.type}${selected ? ' isSelected' : ''}`}
                style={position}
                aria-pressed={selected}
                onClick={() =>
                  dispatch({
                    type: 'select-entity',
                    entityId: entity.id,
                  })
                }
              >
                <span className="worldEntityMarker" aria-hidden="true" />
                <span>{entity.label}</span>
              </button>
            );
          })}
        </div>

        <aside className="entityInspector" aria-live="polite">
          {selectedEntity ? (
            <>
              <p className="inspectorType">{selectedEntity.type.replaceAll('-', ' ')}</p>
              <h3>{selectedEntity.label}</h3>
              <p>{selectedEntity.description}</p>

              <div className="relationshipSection">
                <h4>Relationships</h4>

                {relationships.length > 0 ? (
                  <ul>
                    {relationships.map((relationship) => (
                      <li key={relationship.id}>
                        {relationshipText(relationship, selectedEntity)}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No relationships defined yet.</p>
                )}
              </div>

              <button
                type="button"
                className="clearSelection"
                onClick={() =>
                  dispatch({
                    type: 'select-entity',
                    entityId: null,
                  })
                }
              >
                Close details
              </button>
            </>
          ) : (
            <div className="inspectorEmpty">
              <p className="inspectorType">Explore</p>
              <h3>Select something in the company.</h3>
              <p>
                The environment is built from entities and relationships in the Trinity6 World
                Engine.
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
