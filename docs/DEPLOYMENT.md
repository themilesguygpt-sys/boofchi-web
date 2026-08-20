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

Current demo URL: pending initial Cloudflare authorization/deployment

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

Connect the GitHub repository with Cloudflare's native Git integration and official OAuth flow. Use these settings:

- Repository: `themilesguygpt-sys/boofchi-web`
- Production branch: `main`
- Worker name: `boofchi-web`
- Root directory: `apps/web`
- Install command: `pnpm install --frozen-lockfile` (Workers Builds automatic dependency install)
- Build command: `pnpm cf:build`
- Deploy command: `pnpm exec opennextjs-cloudflare deploy`
- Non-production branch deploy command: `pnpm exec opennextjs-cloudflare upload`
- Build variables: `NODE_VERSION=24` and `PNPM_VERSION=11.22.0`
- Application secrets or runtime environment variables: none

The app-scoped scripts are available because the configured root is `apps/web`; root-level `pnpm cf:*` scripts forward to the same workspace for local use. Every approved push to `main` will run the build and deploy commands after the Git integration is authorized. Non-production branch builds may be enabled to upload preview versions without promoting them.

## Human authorization boundary

Cloudflare account access and GitHub App/OAuth consent must be completed by the account owner in the official Cloudflare dashboard. Do not share passwords, browser cookies, OAuth credentials, API tokens, or account secrets in chat. Workers Builds creates and manages its build authorization through the dashboard; the current app requires no application secrets.

## Rollback

GitHub `main` remains the source of truth, and Cloudflare output is generated from it. Do not make canonical application-code edits in Cloudflare's editor. Fix a broken deployment with a reviewed Git commit or revert and let Workers Builds redeploy it; Git history preserves the rollback points.

Connecting the production domain, changing DNS, and migrating away from the existing production host remain future work after client approval.
