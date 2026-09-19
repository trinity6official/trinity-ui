# Trinity UI Roadmap

This roadmap is directional. Advancement between phases depends on evidence from the previous phase, not calendar pressure.

## Phase 0 — Engineering foundation

**Goal:** establish a production-quality repository before feature growth.

Deliverables:

- product, architecture, contribution, and agent-development guardrails;
- Next.js + React + strict TypeScript application scaffold;
- formatting, linting, type checking, tests, build verification;
- CI and repository hygiene/security checks;
- base design tokens and accessibility conventions;
- ADR process and dependency boundaries.

Exit criteria: a minimal application deploys cleanly and all quality gates run automatically.

## Phase 1 — World engine v1

**Goal:** prove a renderer-independent model for interactive environments.

Deliverables:

- typed Scene, Entity, Relationship, Hotspot, View, and Experience contracts;
- content registry separated from rendering;
- selection/focus/navigation state;
- renderer adapter boundary;
- accessible non-visual representation of entities and actions;
- fixture-driven tests.

Exit criteria: the same world model can be consumed without embedding domain logic in React/renderer code.

## Phase 2 — Company building v1

**Goal:** ship one polished, useful environment.

Deliverables:

- exterior/entry experience;
- office and employee workstation;
- networking/Wi-Fi/firewall;
- server room and database;
- cloud/application connections;
- CCTV/physical access;
- responsive desktop/mobile interaction;
- information panel and relationship exploration;
- performance budgets and reduced-motion fallback.

Exit criteria: users can understand and navigate the building without instructions.

## Phase 3 — First guided experiences

**Goal:** validate that interaction teaches better than static marketing content.

Initial candidates:

- How a company gets hacked — and how to protect it;
- How a company network works;
- How phishing becomes an incident;
- Follow data from user to database;
- Protect a server.

Deliverables include deep-linkable/shareable experience URLs, progress, restart/replay, and basic anonymous usage analytics.

Exit criteria: measurable completion, repeat interaction, and sharing signals justify continued investment.

## Phase 4 — Trinity interaction

**Goal:** make natural language manipulate/explain the world.

Start with a constrained typed command protocol: focus entity, highlight relationship, start experience, explain entity, compare states. Keep provider-specific AI details behind `TrinityService`.

Later integrate with `trinity-ai` through a versioned API contract.

Exit criteria: Trinity materially improves discovery/comprehension rather than acting as generic chat.

## Phase 5 — Identity and persistence

**Goal:** support returning users.

Introduce the dedicated platform backend when requirements are concrete. Likely capabilities: accounts, profiles, saved progress, projects, permissions, content metadata, quotas, membership state, and analytics events.

This is the likely point to create `trinity-backend`; do not turn `trinity-ai` into the platform backend.

## Phase 6 — Build workspace

**Goal:** help users move from AI/business ideas to execution.

Potential flows: start an AI business, launch an app/SaaS, creator journey, digital product, AI agency. Model milestones and evidence instead of arbitrary gamification. Trinity helps research, plan, create artifacts, and track next actions.

Validate one journey before adding many.

## Phase 7 — Creator Studio

**Goal:** let creators/educators build experiences without code.

Capabilities may include templates, object placement, relationships, steps/narration, quizzes/challenges, preview, publishing, share/embed, creator profiles, and analytics.

Free creation should be useful enough to create distribution. Paid capability should target professional usage.

## Phase 8 — Membership and professional features

Potential value: higher AI/creation limits, multiple/private projects, premium templates/assets, advanced analytics, collaboration, integrations, automation, and professional branding.

Pricing follows measured willingness to pay and infrastructure cost.

## Phase 9 — Marketplace

Only after healthy creator supply and consumer demand: discoverable templates, lessons, simulations, labs, and paid experiences; creator monetization and platform economics.

## Phase 10 — My Organization

**Long-term:** connect authorized real-world systems and visualize an organization using actual asset/integration data. Possible layers include security, compliance, privacy, identity, operations, dependencies, and business impact.

This phase requires mature backend, tenancy, authorization, auditability, data governance, and security architecture.

## Expansion rule

The engine may support arbitrary worlds, but public product scope expands only when user/creator demand validates a new domain.
