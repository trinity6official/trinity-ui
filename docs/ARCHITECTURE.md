# Architecture

## System boundaries

```text
trinity-ui
  Web / visual world / interaction / creator and project UX
       |
       | versioned APIs
       v
future trinity-backend
  accounts / persistence / authorization / memberships / content metadata /
  billing / platform business logic / analytics
       |
       +------> trinity-ai
                 models / routing / memory / agents / skills / AI execution
```

The backend is intentionally deferred until persistence/business requirements justify the operational boundary.

## Client architecture target

```text
src/
  app/                 routing and composition
  components/          reusable presentation primitives
  features/
    world/
      domain/           renderer-independent models/rules
      application/      use cases/state transitions
      infrastructure/   adapters/loaders
      presentation/     React/UI integration
    trinity/
      domain/
      application/
      infrastructure/
      presentation/
    experiences/
  services/             typed external boundaries
  config/
  lib/
  styles/
  types/
```

Directories are introduced when implementation requires them; do not create empty architecture theater.

## World model

The world is a graph, not a pile of clickable coordinates.

- **Scene:** bounded environment/view.
- **Entity:** meaningful object/person/system.
- **Relationship:** typed connection between entities.
- **Hotspot:** optional interaction affordance associated with an entity or region.
- **Experience:** ordered/branching instructional or simulation flow operating on the world.
- **Domain layer:** cybersecurity, networking, privacy, AI, etc. Domain knowledge enriches entities but does not own rendering.

A renderer consumes world state. It must not become the source of truth.

## Rendering

Do not prematurely commit the platform to heavy 3D. Phase 1 should allow 2D/isometric, DOM/SVG/canvas, or later WebGL renderers behind an adapter. Choose the rendering technology based on the building prototype, mobile performance, accessibility, asset pipeline, and creator requirements.

## Service boundaries

UI code consumes interfaces such as `TrinityService`, `ExperienceRepository`, and future `ProjectService`. Early implementations may use static/local data. Remote implementations can later replace them without rewriting presentation code.

## State

Separate durable server state, URL/shareable state, world interaction state, and ephemeral UI state. Do not place everything in a global store.

## Content

Educational/domain content must be structured, versionable, and render-independent. Treat future creator content as untrusted.

## Performance

Interactive visuals must have explicit performance budgets. Prefer progressive loading, optimized assets, code splitting, and graceful fallback. Mobile is a first-class client.

## Accessibility

Every important visual entity/action needs a semantic accessible equivalent. Keyboard navigation, focus management, contrast, reduced motion, and screen-reader paths are product requirements.

## Security

No secrets in client code. Validate untrusted content at boundaries. Avoid unsafe HTML execution. Future authentication/authorization is enforced server-side; client checks are UX only.

## Decision records

Material decisions go in `docs/decisions/` using lightweight ADRs: context, decision, alternatives, consequences.
