'use client';

import { useMemo, useReducer } from 'react';

import {
  createWorldState,
  reduceWorldState,
  type ExperienceStep,
  type WorldEntity,
  type WorldRelationship,
} from '@/features/world';

import { companyScene } from '../content/company-scene';
import { createRelationshipLines, type EntityPoint } from './relationship-geometry';

const positions: Readonly<Record<string, EntityPoint>> = {
  employee: { x: 11, y: 20 },
  laptop: { x: 27, y: 31 },
  wifi: { x: 43, y: 20 },
  firewall: { x: 58, y: 38 },
  server: { x: 72, y: 28 },
  database: { x: 81, y: 59 },
  cloud: { x: 70, y: 7 },
  cctv: { x: 15, y: 65 },
  access: { x: 34, y: 70 },
};

const relationshipLines = createRelationshipLines(companyScene.relationships, positions);

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

function isEntityInStep(entityId: string, step: ExperienceStep | null): boolean {
  return step?.entityIds?.includes(entityId) ?? false;
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

  const activeExperience = useMemo(
    () =>
      state.activeExperienceId
        ? (companyScene.experiences.find(
            (experience) => experience.id === state.activeExperienceId,
          ) ?? null)
        : null,
    [state.activeExperienceId],
  );

  const activeStep =
    activeExperience !== null && state.activeExperienceStepIndex !== null
      ? (activeExperience.steps[state.activeExperienceStepIndex] ?? null)
      : null;

  const activeStepNumber =
    activeStep !== null && state.activeExperienceStepIndex !== null
      ? state.activeExperienceStepIndex + 1
      : null;

  const isLastStep =
    activeExperience !== null &&
    state.activeExperienceStepIndex !== null &&
    state.activeExperienceStepIndex === activeExperience.steps.length - 1;

  return (
    <section className="companyExperience" aria-labelledby="company-world-title">
      <div className="companyExperienceHeader">
        <div>
          <p className="eyebrow">World 01 · Company</p>
          <h2 id="company-world-title">Explore how a digital company works.</h2>
          <p>Inspect individual systems or follow a guided experience through the environment.</p>
        </div>

        {!activeExperience ? (
          <button
            type="button"
            className="startExperience"
            onClick={() =>
              dispatch({
                type: 'start-experience',
                experienceId: 'company-attack-path',
              })
            }
          >
            How a company gets hacked
          </button>
        ) : (
          <p className="companyHint">Guided experience active</p>
        )}
      </div>

      {activeExperience && activeStep && activeStepNumber !== null ? (
        <div className="experienceGuide" aria-live="polite">
          <div className="experienceProgress">
            <span>
              Step {activeStepNumber} of {activeExperience.steps.length}
            </span>
            <progress value={activeStepNumber} max={activeExperience.steps.length}>
              {activeStepNumber} of {activeExperience.steps.length}
            </progress>
          </div>

          <div className="experienceNarrative">
            <div>
              <p className="inspectorType">Guided experience</p>
              <h3>{activeStep.title}</h3>
              <p>{activeStep.description}</p>
            </div>

            <div className="experienceActions">
              <button
                type="button"
                disabled={state.activeExperienceStepIndex === 0}
                onClick={() =>
                  dispatch({
                    type: 'previous-experience-step',
                  })
                }
              >
                Previous
              </button>

              <button
                type="button"
                onClick={() =>
                  dispatch({
                    type: isLastStep ? 'stop-experience' : 'advance-experience',
                  })
                }
              >
                {isLastStep ? 'Finish' : 'Next'}
              </button>

              <button
                type="button"
                className="experienceExit"
                onClick={() =>
                  dispatch({
                    type: 'stop-experience',
                  })
                }
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      ) : null}

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

          <svg
            className="relationshipMap"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {relationshipLines.map((relationship) => {
              const active = activeStep?.relationshipIds?.includes(relationship.id) ?? false;

              return (
                <line
                  key={relationship.id}
                  className={[
                    'relationshipLine',
                    active ? 'isActive' : '',
                    activeStep && !active ? 'isDeemphasized' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  x1={relationship.x1}
                  y1={relationship.y1}
                  x2={relationship.x2}
                  y2={relationship.y2}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>

          {companyScene.entities.map((entity) => {
            const position = positions[entity.id];

            if (!position) {
              return null;
            }

            const selected = entity.id === state.selectedEntityId;
            const highlighted = isEntityInStep(entity.id, activeStep);

            return (
              <button
                key={entity.id}
                type="button"
                className={[
                  'worldEntity',
                  `worldEntity--${entity.type}`,
                  selected ? 'isSelected' : '',
                  highlighted ? 'isHighlighted' : '',
                  activeStep && !highlighted ? 'isDeemphasized' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                }}
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
              <p className="inspectorType">{activeExperience ? 'Guided experience' : 'Explore'}</p>
              <h3>
                {activeExperience
                  ? 'Follow the highlighted systems.'
                  : 'Select something in the company.'}
              </h3>
              <p>
                {activeExperience
                  ? 'The environment changes emphasis as you move through each step.'
                  : 'The environment is built from entities and relationships in the Trinity6 World Engine.'}
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}
