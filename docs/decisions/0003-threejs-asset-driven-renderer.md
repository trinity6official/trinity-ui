# ADR 0003: Three.js runtime with asset-driven 3D scenes

## Status

Accepted

## Context

The initial Trinity6 company renderer used DOM/SVG and later procedural Three.js geometry to validate interaction, relationship visualization, touch selection, and camera movement.

Those prototypes proved important architecture and interaction concepts, but they did not meet the intended visual direction.

The product requires:

- a complete multi-floor company world;
- spatial room/device navigation;
- secure entrance interaction;
- visible physical infrastructure;
- mobile-first camera behavior;
- premium architectural visual quality.

A static generated image can match the visual target but cannot serve as the actual world model because it has no spatial object hierarchy, semantic geometry, or real camera navigation.

Three.js can provide the required runtime behavior, but authoring an entire production building from low-level procedural primitives would create poor visual quality and excessive renderer code.

The repository currently uses React 19.3. The tested current React Three Fiber release declared a peer range that excluded React 19.3, so the project will not force that dependency.

## Decision

Use **Three.js directly** as the 3D runtime for the Trinity6 visual world.

Use professional, portable `.glb/.gltf` assets for production architectural content.

Blender is the preferred production authoring tool, but Blender itself is not a runtime dependency.

The exported runtime asset and semantic mapping live under repository control.

Procedural Three.js geometry remains appropriate for prototypes, debugging, simple primitives, and fallbacks.

The generic World Engine remains renderer-independent.

Renderer-specific responsibilities include:

- 3D positions;
- object hierarchy mapping;
- materials;
- lighting;
- animation;
- camera presets;
- raycasting;
- WebGL performance behavior.

Trinity and world actions operate on semantic IDs rather than Three.js object references.

## Initial navigation model

```text
Company
  ↓
Entrance
  ↓
Lobby
  ↓
Floor
  ↓
Room
  ↓
Rack / equipment
  ↓
Device
```

Mobile and desktop may use different camera presets.

## Initial secure-entry interaction

```text
Full company view
      ↓
Select access card
      ↓
Touch reader / entrance
      ↓
Verification
      ↓
Doors open
      ↓
Camera enters lobby
```

The full-company view is the landing experience; the entrance is not the entire landing page.

## Asset pipeline

```text
Blender / authored source
        ↓
GLB / GLTF
        ↓
Three.js loader
        ↓
semantic renderer mapping
        ↓
World Engine / Trinity commands
```

## Consequences

### Positive

- supports genuine spatial interaction;
- preserves renderer-independent domain architecture;
- supports premium authored assets;
- avoids SaaS lock-in for runtime scenes;
- keeps exported assets in repository-controlled formats;
- allows real camera navigation and object-level interaction;
- supports future digital-twin overlays and guided simulations.

### Costs

- introduces a real 3D asset pipeline;
- requires optimization for mobile GPUs;
- requires asset naming and validation conventions;
- requires a separate accessible DOM interaction layer;
- production visual fidelity now depends on 3D art/asset quality as well as code.

## Rejected alternatives

### Continue DOM/SVG as the primary renderer

Rejected because it cannot deliver the intended spatial drill-down and architectural experience.

### Build the full production company from Three.js primitives

Rejected as the production strategy because it leads to engineering-heavy scene code and insufficient visual fidelity.

### Use a static AI-generated building image as the world

Rejected because it is not a real spatial model and cannot support the required semantic interactions.

Static/generated images may be used as art-direction references.

### Force React Three Fiber despite peer dependency mismatch

Rejected.

The project will not use `--force` or `--legacy-peer-deps` to hide an incompatible dependency tree.
