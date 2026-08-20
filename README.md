# Boofchi Storefront

Boofchi is a Persian-first storefront for anime, gaming, pop-culture, and collectible merchandise. This repository is currently the engineering foundation for a client-facing demo; it does not yet contain the production catalog or commerce backend.

## Repository

- `apps/web` — Next.js App Router storefront
- `packages/design-tokens` — platform-neutral visual tokens and web CSS variables
- `packages/contracts` — backend-independent catalog domain contracts
- `packages/config` — shared TypeScript and ESLint configuration
- `docs` — permanent architecture, product, RTL, deployment, and performance rules

## Local development

Requirements: Node.js 20.9 or newer and Corepack.

```bash
corepack enable
pnpm install
pnpm dev
```

Open `http://localhost:3000`. Copy `.env.example` to `.env.local` only when local configuration is needed.

## Validation

```bash
pnpm lint
pnpm type-check
pnpm build
```

Run `pnpm validate` to execute all three checks. Permanent engineering constraints live in `docs/PROJECT_CONTRACT.md`; contributors and coding agents must also follow `AGENTS.md`.
