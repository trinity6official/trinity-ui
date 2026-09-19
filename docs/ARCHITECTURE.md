# Architecture

## System boundaries

```text
trinity-ui
  visual world / interaction / creator and project UX
       |
       | versioned APIs
       v
future trinity-backend
  accounts / persistence / authorization / memberships /
  content metadata / billing / platform business logic / analytics
       |
       +------> trinity-ai
                 models / routing / memory / agents / skills / AI execution
```

The platform backend remains intentionally deferred until persistence and business requirements justify it.

## Client architecture target

```text
src/
  app/
  components/
  features/
    world/
      domain/
      application/
      infrastructure/
      presentation/
    trinity/
      domain/
      application/
      infrastructure/
      presentation/
    company-world/
      content/
      presentation/
        three/
    experiences/
  services/
  config/
  lib/
  styles/
  types/
```

Directories are introduced only when implementation requires them.

## Core dependency direction

```text
Trinity / external intelligence
          ↓
     TrinityCommand
          ↓
  command interpreter
          ↓
       WorldAction
          ↓
      World Engine
          ↓
   renderer adapter
          ↓
     Three.js scene
```

The dependency direction must not reverse.

In particular:

- the World Engine must not import Three.js;
- the World Engine must not contain 3D coordinates or renderer materials;
- Trinity commands must not directly manipulate Three.js objects;
- the renderer maps semantic world IDs to spatial objects.

## World model

The world is a graph, not a collection of clickable screen coordinates.

Core concepts:

- **Scene** — bounded environment/view;
- **Entity** — meaningful object, person, or system;
- **Relationship** — typed connection;
- **Hotspot** — optional interaction affordance;
- **View** — meaningful presentation/navigation state;
- **Experience** — ordered or branching instructional/simulation flow.

Runtime interaction state remains separate from the immutable domain content.

## Rendering decision

The renderer decision has evolved based on prototype evidence.

The earlier DOM/SVG visualization successfully validated world state, relationship rendering, and guided experiences, but it did not support the intended spatial experience.

The production direction is now:

- Three.js as the browser 3D runtime;
- WebGL rendering;
- raycasting for pointer/touch interaction;
- camera navigation;
- standard `.glb/.gltf` scene assets;
- semantic object naming and mapping;
- DOM accessibility layer around the canvas.

React Three Fiber is not currently part of the stack because the tested current release declares a React peer range that excludes React 19.3.

We do not use `--force` or `--legacy-peer-deps` to hide that incompatibility.

## Runtime vs authoring

Three.js is not the production modeling tool.

Responsibilities:

```text
Blender / asset authoring
        ↓
GLB / GLTF
        ↓
asset loader / semantic mapping
        ↓
Three.js runtime
        ↓
camera / interaction / animation / overlays
        ↓
World Engine + Trinity
```

Procedural Three.js geometry is appropriate for:

- renderer prototypes;
- debug geometry;
- interaction tests;
- simple generated primitives;
- fallback visualization.

Production architecture, furniture, infrastructure, and detailed props should use authored assets.

## Scene asset boundary

Renderer-specific spatial metadata must remain outside the generic World Engine.

A semantic entity can map to one or more render objects.

Example:

```text
World entity:
  server-042

Renderer objects:
  Floor02/ServerRoom/Rack03/Server042
  Floor02/CableTray/Cable_Server042
  Floor02/Indicator/Server042
```

The semantic ID is stable even if the visual asset changes.

## Object naming conventions

Production GLB objects should use stable, readable names.

Example:

```text
TrinityCompany
  Exterior
  Floor_01
    Lobby
    EntranceDoor_Left
    EntranceDoor_Right
    CardReader
  Floor_02
    ServerRoom
      Rack_01
        Server_01
        Server_02
  Floor_03
    Office
  Floor_04
    NetworkRoom
      Switch_01
      Firewall_01
```

Do not rely on Blender-generated anonymous names as application contracts.

## Camera/navigation

Navigation is hierarchical:

```text
Company
  ↓
Floor
  ↓
Room
  ↓
Rack / equipment
  ↓
Device
```

Every drill-down must have an obvious reverse path.

Desktop and mobile may use different camera presets.

Mobile must not simply shrink the desktop composition.

## Input model

Desktop:

- hover for discovery;
- click to select/activate;
- keyboard equivalents.

Mobile:

- tap to select;
- tap/explicit action to activate;
- large hit areas;
- no interaction that depends only on hover.

## Secure entrance interaction

The initial entry flow is:

```text
Company overview
      ↓
Select access card
      ↓
Touch card reader / entrance
      ↓
Verification
      ↓
Reader state changes
      ↓
Doors open
      ↓
Camera enters lobby
```

The access-card UI button remains an accessible assisted path, not the only way to interact.

## Digital twin overlays

Digital overlays must be layered onto believable architecture.

Examples:

- physical cable path;
- active network path;
- data flow;
- security boundary;
- selected entity;
- compliance/risk state.

Avoid turning the environment into a neon network graph.

## Service boundaries

Presentation code should consume explicit service interfaces such as:

- `TrinityService`;
- future `ExperienceRepository`;
- future `ProjectService`;
- future asset/scene registry abstractions where useful.

Remote implementation details must not spread across React components.

## State

Keep separate:

- durable server state;
- URL/shareable state;
- semantic world state;
- renderer navigation/camera state;
- ephemeral UI state.

Do not put all state into a single global store.

## Content

Educational/domain content remains structured, versionable, and render-independent.

Future creator content is untrusted and must be validated at boundaries.

## Performance

3D introduces explicit budgets.

Requirements include:

- progressive loading;
- compressed assets where appropriate;
- texture-size budgets;
- limited draw calls/material count;
- capped device pixel ratio;
- LOD where useful;
- mobile-first testing;
- graceful WebGL failure behavior;
- reduced-motion behavior.

Production asset choices must consider GPU/memory cost, not only visual fidelity.

## Accessibility

Canvas/WebGL is not a semantic UI.

Every important action must have an accessible DOM equivalent.

Requirements include:

- semantic buttons/actions;
- keyboard navigation;
- focus management;
- contrast;
- reduced motion;
- screen-reader descriptions;
- non-WebGL fallback for critical information.

## Security

- no secrets in client code;
- validate untrusted content;
- avoid unsafe HTML execution;
- future authorization is enforced server-side;
- client-side access states are presentation only unless backed by server authorization.

## Decision records

Material decisions live in `docs/decisions/`.

Current renderer decisions:

- ADR 0002 — renderer-independent World Engine;
- ADR 0003 — Three.js runtime with asset-driven 3D scenes.
