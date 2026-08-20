# Boofchi engineering rules

Before changing this repository, read `docs/PROJECT_CONTRACT.md` and the relevant files in `docs/`. Respect the requested scope exactly; do not redesign unrelated areas or implement documented future-scope features without an explicit request.

- Preserve Persian-first RTL behavior and the BiDi rules in `docs/RTL_BIDI_RULES.md`.
- Preserve the existing design tokens and architectural boundaries. Report conflicts instead of silently introducing alternate patterns.
- Use Server Components by default. Add Client Components and browser JavaScript only when interaction requires them.
- Protect mobile performance, accessibility, visible focus, and reduced-motion behavior.
- Avoid unnecessary dependencies, broad refactors, and premature abstractions.
- Never expose secrets or commit local environment files.
- Run root-level lint, type-check, and production build validation before committing.
