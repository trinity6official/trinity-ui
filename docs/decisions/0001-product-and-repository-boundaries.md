# ADR 0001: Product and repository boundaries

**Status:** Accepted

## Context

Trinity6 may evolve from an interactive technology-learning building into creator, project, membership, and organizational experiences. Trinity AI already exists as a separate project.

## Decision

`trinity-ui` owns user-facing web/world experience. It is designed around renderer-independent world/domain contracts.

`trinity-ai` remains responsible for AI intelligence such as model routing, memory, agents, and skills.

A separate platform backend will be introduced only when persistence, accounts, permissions, billing, creator publishing, or similar business requirements justify it.

The initial product is focused on technology/cybersecurity/AI and digital building rather than arbitrary “everything worlds”, while the world model remains domain-neutral.

## Consequences

We avoid premature distributed-system overhead while preserving clean seams. The UI cannot assume direct ownership of durable business data or AI implementation details. Future backend APIs must be versioned contracts rather than leaking database models into the client.
