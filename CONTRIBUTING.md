# Contributing

## Branches and pull requests

Use short-lived branches and PRs. Suggested prefixes: `feat/`, `fix/`, `chore/`, `docs/`, `refactor/`.

A PR should explain the problem, approach, user impact, verification performed, screenshots for visual changes, and known follow-ups. Avoid mixing unrelated refactors with feature work.

## Definition of done

A change is done when it is understandable, typed, tested at the appropriate level, accessible for its interaction model, documented where necessary, free of secrets/generated runtime state, and passes repository quality checks.

## Architecture changes

Material architectural choices should be recorded under `docs/decisions/` as an ADR. Prefer reversible decisions early in the product lifecycle.

## Security

Never commit credentials or customer data. Treat all future API responses and creator-authored content as untrusted input. Security controls belong at trust boundaries, not only in UI validation.
