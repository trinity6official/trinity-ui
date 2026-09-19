# Trinity UI

Trinity UI is the visual and interactive experience layer for the Trinity ecosystem.

The long-term product vision is an interactive environment where people can **explore, learn, build, create, and run** with Trinity as the intelligence layer. The first product surface is a high-quality interactive company building that teaches technology and cybersecurity through meaningful objects, relationships, and guided scenarios.

## Product principles

1. **Utility before spectacle** — every visual interaction must help a user understand, create, decide, or accomplish something.
2. **Focused product, broad architecture** — initial content focuses on cybersecurity, networking, cloud, AI, software, data, privacy, GRC, and technology-enabled business creation. The world engine must not hard-code those domains.
3. **Trinity is intelligence, not a corner chatbot** — Trinity should eventually explain, navigate, manipulate, and help users build within the experience.
4. **Progressive complexity** — ship one excellent building before cities, marketplaces, or arbitrary worlds.
5. **Accessible by default** — core information and actions must not require precise pointer input or 3D navigation.
6. **Clean boundaries** — UI, world model, content, domain knowledge, persistence, and AI integrations remain separable.

## Repository responsibility

This repository owns the public Trinity6 web experience, world rendering and interaction UI, reusable design system, client-side world/entity/relationship models, learning/simulation presentation, future creator/project interfaces, and typed clients for future platform and Trinity APIs.

It does **not** own Trinity model routing, memory, agents, or skills (those belong in `trinity-ai`), nor authoritative platform data, billing, accounts, permissions, or business logic once a dedicated backend is introduced.

See [Product Vision](docs/PRODUCT_VISION.md), [Roadmap](docs/ROADMAP.md), and [Architecture](docs/ARCHITECTURE.md).

## Current status

**Phase 0 — Foundation.** Product, architecture, roadmap, contribution, and AI-agent guardrails are established first. Application scaffolding and CI follow in the next implementation milestone.
