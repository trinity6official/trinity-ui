# ADR 0002: Renderer-independent world engine

## Status

Accepted

## Context

Trinity6 needs interactive worlds that can evolve independently from any single rendering technology or subject domain.

The first public environment will represent a company, but future environments may represent other technical or creator-defined systems. Rendering requirements may also evolve between DOM, SVG, Canvas, WebGL, or combinations of those technologies.

## Decision

The world model is implemented as renderer-independent TypeScript domain contracts.

Scenes contain entities, relationships, hotspots, views, and guided experiences. Runtime interaction state is maintained separately from the domain model.

The domain and application layers must not depend on React, Next.js, browser rendering APIs, cybersecurity-specific concepts, or a particular renderer.

Rendering layers may depend on the world model. The world model must not depend on rendering layers.

Structured world content is validated before it is trusted by downstream consumers.

## Consequences

The same world content can support multiple renderers and accessible representations.

Domain content can evolve without modifying the rendering engine.

Trinity commands can target stable world IDs instead of DOM coordinates or renderer-specific objects.

The architecture requires explicit adapters between world state and future renderers, which adds a small amount of structure in exchange for long-term separation of concerns.
