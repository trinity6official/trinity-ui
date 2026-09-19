# Engineering Instructions

These rules apply to all human and AI-authored changes in this repository.

## Non-negotiable quality rules

- Prefer small, reviewable pull requests with one clear responsibility.
- Never commit secrets, credentials, tokens, generated runtime state, local databases, caches, build output, or dependency directories.
- Use TypeScript in strict mode for application code.
- Do not use `any` as an escape hatch. Narrow unknown data at boundaries.
- Keep React components focused on presentation/composition. Business rules and domain logic belong outside rendering components.
- Do not hard-code cybersecurity/GRC knowledge into scene-rendering components. Content/domain data must be modeled separately.
- Do not couple the world engine to one domain, one building, or one content type.
- Do not call AI providers, databases, billing providers, or authentication providers directly from arbitrary UI components. Use explicit service/client boundaries.
- Prefer composition over large configurable “god components”.
- New dependencies require a concrete need; prefer platform capabilities and existing dependencies.
- User-visible interactive features require keyboard-accessible alternatives and sensible reduced-motion behavior.
- Important domain logic requires tests. Bugs should receive regression tests when practical.
- Keep public interfaces typed and intentionally small.
- Delete dead code rather than preserving speculative abstractions.

## Change workflow

1. Read relevant product/architecture docs.
2. State the user problem and acceptance criteria.
3. Implement the smallest coherent change.
4. Run formatting, linting, type checking, tests, and build checks applicable to the change.
5. Review the diff for secrets, generated files, accidental coupling, accessibility regressions, and unnecessary dependencies.
6. Update documentation when architecture or product behavior changes.
7. Open a PR with summary, testing evidence, screenshots for visual changes, and risks/follow-ups.

## Architecture rule

Dependencies should point inward toward stable domain contracts. Rendering may depend on world/domain models; world/domain models must not depend on React or a particular renderer.

## Product rule

Do not build “metaverse” features merely because they look impressive. Every feature must support a validated user outcome: explore, learn, build, create, or run.
