# Trinity UI Roadmap

This roadmap is directional. Progress between milestones depends on evidence and product quality rather than calendar pressure.

## Completed — Engineering foundation

Established:

- production Next.js / React / strict TypeScript baseline;
- formatting, linting, type checking, tests, build verification;
- CI and repository hygiene/security checks;
- dependency and architecture guardrails;
- ADR process;
- accessibility conventions.

## Completed — World Engine v1

Delivered:

- renderer-independent Scene, Entity, Relationship, Hotspot, View, and Experience contracts;
- validated structured world content;
- world interaction state;
- selection/focus/view state;
- guided-experience state transitions;
- fixture-driven tests.

The World Engine remains independent from React, Three.js, WebGL, and domain-specific content.

## Completed — Company content v1

Delivered an initial company graph including:

- employee;
- laptop;
- Wi-Fi;
- firewall;
- application server;
- database;
- cloud service;
- CCTV;
- physical access;
- relationships between those entities.

This content remains useful underneath the new 3D presentation.

## Completed — Guided Experience v1

Delivered:

- first guided experience:
  **How a company gets hacked — and how to protect it**;
- step progression;
- previous/next/finish/exit behavior;
- entity and relationship emphasis.

## Completed — Relationship Visualization v1

Delivered renderer-side visualization of active relationships without leaking domain content into the World Engine.

## Completed — Trinity Command Protocol v1

Delivered a typed intelligence-facing command contract including:

- select entity;
- focus entity;
- activate view;
- start experience;
- advance/previous experience;
- stop experience.

Unknown external input is validated before translation into `WorldAction`.

## Completed — Trinity Integration v1

Delivered the first path:

```text
unknown Trinity input
        ↓
parseTrinityCommand
        ↓
TrinityCommand
        ↓
interpretTrinityCommand
        ↓
WorldAction
        ↓
World Engine
```

No model/provider dependency is required yet.

---

# Current milestone — Visual World Renderer v1

## Goal

Turn the existing world model into a genuine spatial company environment.

The first screen should show the **entire company**, not an isolated entrance.

The visual target is a premium interactive architectural digital twin with mobile-first usability.

## Renderer direction

Selected:

- Three.js runtime;
- WebGL rendering;
- raycast interaction;
- semantic object IDs;
- camera navigation;
- `.glb/.gltf` production assets;
- renderer-specific spatial metadata outside the generic World Engine.

React Three Fiber is not currently used because the tested current release has a React peer range that excludes the repository's React 19.3 version.

The repository will not force or hide that dependency conflict.

## Visual World Renderer v1A — Interaction prototype

Status: **in progress**

Deliver:

- full multi-floor company view;
- zoomed-out mobile and desktop camera;
- touch/raycast selection;
- recognizable office, network, server, security, and entrance areas;
- physical access card;
- entrance/reader interaction;
- door opening;
- camera transition from overview → entrance → lobby;
- accessible DOM controls/fallback.

The current procedural Three.js building exists to prove behavior and architecture, not final art quality.

## Visual World Renderer v1B — Asset pipeline

Next.

Deliver:

- Blender source directory and conventions;
- deterministic export script;
- `.glb` output directory;
- GLTFLoader integration;
- semantic object naming conventions;
- PBR material conventions;
- texture/asset budgets;
- LOD / progressive loading strategy;
- mobile GPU/performance budgets;
- environment/lighting strategy.

## Visual World Renderer v1C — Reference-quality company asset

Deliver one production-quality company model with:

- complete exterior;
- cutaway floors;
- lobby;
- office workspace;
- network room;
- server room;
- security area;
- rooftop/landscaping;
- furniture and infrastructure;
- named interactive objects;
- production lighting/materials.

Exit criterion:

The full company view is visually compelling without relying on a static generated image.

## Visual World Renderer v1D — Spatial drill-down

Deliver:

```text
Company
  → Entrance
  → Lobby
  → Floor
  → Room
  → Rack
  → Device
```

Camera navigation must preserve a clear back path.

## Visual World Renderer v1E — Digital twin overlays

Deliver:

- physical network/data paths;
- restrained cyan digital overlays;
- relationship highlighting;
- system status indicators;
- Trinity-driven focus/highlight commands.

The digital overlay sits on top of believable architecture.

---

## Next — Trinity AI integration

Connect `trinity-ui` to `trinity-ai` through a versioned service boundary.

Initial intelligence operations should map to the existing typed command protocol.

Example:

```text
"Show me the server room"
      ↓
Trinity AI
      ↓
focus entity / activate view
      ↓
camera navigates to server room
```

Provider-specific details remain behind a `TrinityService`.

## Richer guided experiences

Expand only after the renderer is strong enough to support them spatially.

Candidates:

- How a company gets hacked — and how to protect it;
- How a company network works;
- How phishing becomes an incident;
- Follow data from user to database;
- Protect a server.

## Identity and persistence

Introduce a dedicated platform backend when requirements are concrete.

Likely responsibilities:

- accounts;
- profiles;
- saved progress;
- projects;
- permissions;
- content metadata;
- membership state;
- quotas;
- analytics events.

Do not turn `trinity-ai` into the platform backend.

## Build workspace

Help users move from an idea to execution.

Validate one high-value journey before adding many.

## Creator Studio

Allow creators and educators to build interactive experiences without code.

## Membership / professional features

Potential value:

- higher AI limits;
- multiple/private projects;
- premium assets/templates;
- advanced analytics;
- collaboration;
- integrations;
- automation;
- professional branding.

## Marketplace

Only after creator supply and user demand are healthy.

## My Organization

Long-term organizational digital twin using authorized real infrastructure data.

This requires mature:

- tenancy;
- authorization;
- auditability;
- backend architecture;
- governance;
- security controls.

## Expansion rule

The engine may technically support many worlds, but product scope expands only when user demand validates the next domain.
