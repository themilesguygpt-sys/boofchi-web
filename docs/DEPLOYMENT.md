# Deployment

## Architecture

```text
Desktop local repo
        ↓
GitHub main
        ↓
Cloudflare Workers Builds
        ↓
OpenNext for Cloudflare
        ↓
Cloudflare Worker
```

GitHub (`themilesguygpt-sys/boofchi-web`) is canonical. Cloudflare is a derived demo/development environment; it does not replace the current production site or change `boofchi.ir` DNS, hosting, or WordPress.

Current demo URL: https://boofchi-web.themilesguygpt.workers.dev

## Local workflow

The permanent working copy is `C:\Users\TheMilesGuy\Desktop\boofchi-web`. Develop normally with `pnpm dev`, then validate from the repository root:

```text
pnpm catalog:validate
pnpm lint
pnpm type-check
pnpm build
pnpm cf:build
pnpm cf:preview
```

On Windows, use `pnpm.cmd` instead of `pnpm` if PowerShell execution policy blocks `pnpm.ps1`. `pnpm cf:deploy` is reserved for an explicitly authorized manual deployment; routine deployments should come from GitHub.

OpenNext warns that native Windows builds are not fully supported and recommends WSL. If a native build fails while creating pnpm symlinks or tracing native `sharp` packages, run `pnpm cf:build` and `pnpm cf:preview` in WSL/Linux; Cloudflare Workers Builds uses Linux and is the canonical deployment build environment. Do not weaken Windows security settings to bypass the warning.

## Cloudflare Workers Builds

Cloudflare's native Git integration is active with these production settings:

- Repository: `themilesguygpt-sys/boofchi-web`
- Production branch: `main`
- Worker name: `boofchi-web`
- Root directory: `/` (repository root)
- Install command: `pnpm install --frozen-lockfile` (Workers Builds automatic dependency install)
- Build command: `pnpm cf:build`
- Deploy command: `pnpm --filter @boofchi/web exec opennextjs-cloudflare deploy`
- Non-production branch builds: disabled
- Build environment: Node 24 and pnpm 11.22.0 (resolved by Workers Builds from the repository configuration; no explicit build variables are required)
- Application secrets or runtime environment variables: none

The repository root is required so the automatic install retains the workspace lockfile and local packages. The root-level `pnpm cf:*` scripts forward to `@boofchi/web`, and the filtered deploy command runs the app-local OpenNext CLI. Every approved push to `main` now automatically runs the build and deploy commands. The first Cloudflare Linux OpenNext build and workers.dev deployment were validated successfully.

## Human authorization boundary

Cloudflare account access and GitHub App/OAuth consent must be completed by the account owner in the official Cloudflare dashboard. Do not share passwords, browser cookies, OAuth credentials, API tokens, or account secrets in chat. Workers Builds creates and manages its build authorization through the dashboard; the current app requires no application secrets.

## Rollback

GitHub `main` remains the source of truth, and Cloudflare output is generated from it. Do not make canonical application-code edits in Cloudflare's editor. Fix a broken deployment with a reviewed Git commit or revert and let Workers Builds redeploy it; Git history preserves the rollback points.

Connecting the production domain, changing DNS, and migrating away from the existing production host remain future work after client approval.
