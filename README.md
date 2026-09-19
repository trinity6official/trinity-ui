# Trinity UI

Trinity UI is the visual and interactive experience layer for the Trinity ecosystem.

The product vision is an interactive environment where people can **explore, learn, build, create, and run** with Trinity as the intelligence layer.

The first public world is a premium interactive digital company: a user begins with a full-company view, explores meaningful rooms and systems, enters through a secure access experience, and can progressively drill into floors, rooms, racks, devices, relationships, and guided scenarios.

## Product principles

1. **Utility before spectacle** — visuals must help a user understand, create, decide, or accomplish something.
2. **World first, entrance second** — the landing experience presents the full company before drilling into individual rooms or systems.
3. **Focused product, broad architecture** — the first content centers on technology, cybersecurity, networking, cloud, AI, software, data, privacy, GRC, and IT infrastructure, while the engine remains domain-neutral.
4. **Trinity is intelligence, not a corner chatbot** — Trinity should explain, navigate, focus, manipulate, simulate, and eventually help users build inside the world.
5. **Progressive complexity** — build one exceptional company world before expanding to cities, marketplaces, or arbitrary worlds.
6. **Accessible by default** — important information and actions must have semantic non-3D equivalents.
7. **Clean boundaries** — world state, rendering, assets, content, AI, persistence, and platform business logic stay separable.
8. **Professional assets, programmable runtime** — Three.js renders and controls the world; it is not the final 3D authoring tool.

## Repository responsibility

This repository owns:

- the public Trinity6 web experience;
- the world renderer and interaction layer;
- client-side world/entity/relationship models;
- guided experience presentation;
- visual scene integration and camera/navigation behavior;
- the 3D asset-loading/runtime layer;
- reusable design system and accessibility behavior;
- future creator/project interfaces;
- typed clients for future platform and Trinity APIs.

It does **not** own Trinity model routing, memory, agents, or skills; those belong in `trinity-ai`.

It also does not own authoritative accounts, billing, permissions, persistence, tenancy, or platform business logic once a dedicated backend is introduced.

## Current implementation status

Completed foundations:

- Engineering foundation
- Renderer-independent World Engine v1
- Company world content v1
- Guided Experience Engine v1
- Relationship Visualization v1
- Trinity Command Protocol v1
- Trinity command integration v1

Current milestone:

**Visual World Renderer v1**

The renderer direction is now explicitly **real 3D / digital twin**, with:

- Three.js as the web runtime;
- a full-company landing composition;
- mobile-first camera framing;
- raycast/touch interaction;
- secure access-card entry;
- spatial drill-down from company → room → rack → device;
- professional `.glb/.gltf` assets as the path to production visual quality.

The current procedural Three.js building is an interaction and architecture prototype. Production visual fidelity will come from an asset-driven 3D pipeline rather than increasingly complex `BoxGeometry`.

See:

- [Product Vision](docs/PRODUCT_VISION.md)
- [Roadmap](docs/ROADMAP.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Visual World Direction](docs/VISUAL_WORLD.md)
- [3D Asset Pipeline](docs/ASSET_PIPELINE.md)
- [ADR 0002 — Renderer-independent world engine](docs/decisions/0002-renderer-independent-world-engine.md)
- [ADR 0003 — Three.js runtime with asset-driven 3D scenes](docs/decisions/0003-threejs-asset-driven-renderer.md)
