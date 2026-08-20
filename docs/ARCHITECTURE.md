# Architecture

## Current foundation

Boofchi uses a pnpm/Turborepo TypeScript monorepo. The only application currently implemented is the Next.js web storefront. Shared contracts isolate UI code from its eventual data provider, while shared design tokens provide platform-neutral source values plus a web adapter.

The web app uses the App Router, Server Components by default, semantic HTML, and portable configuration. It avoids unnecessary Node-only runtime APIs so a later Cloudflare deployment remains practical.

## Intended production shape

```text
Next.js web storefront ─┐
Future Expo mobile app ─┴─> REST API / OpenAPI-oriented contracts
                                  ↓
                         Medusa v2 modular monolith
                                  ↓
                PostgreSQL + Redis + Typesense + object storage/CDN
```

- **Web:** Next.js and TypeScript.
- **Commerce:** Medusa v2, initially as a modular monolith—not microservices.
- **API:** REST with OpenAPI-oriented contracts shared by web and future clients.
- **Data:** PostgreSQL for durable commerce state.
- **Cache/events/workers:** Redis when the production backend is introduced.
- **Search:** Typesense.
- **Media:** S3-compatible object storage delivered through a CDN.
- **Mobile:** Expo and React Native consuming the same REST API.
- **CRM:** a separate future module or service.
- **Recommendations:** a separate future Python service consuming behavioral events.

Services should be extracted only when operational or domain boundaries create a demonstrated need. UI modules must depend on stable application contracts, not raw Medusa responses.

## Catalog boundaries

Product Type (`Category`) and fandom identity (`Universe`, `Fandom`, and `Character`) are separate concepts. A product may belong to one product category and independently reference its story universe, fandom groupings, characters, and curated collections. These are modeled explicitly in `@boofchi/contracts`, not flattened into generic tags.

For the demo, a small in-memory adapter may later implement `CatalogDataSource`. In production, a Medusa REST adapter can implement the same boundary without requiring UI rewrites.

## Money policy (deferred)

`Money.amount` is always an integer canonical stored value. Floating-point monetary values are forbidden. The canonical currency and storage unit (for example, rial, toman, or another explicit representation) will be finalized during the real Boofchi catalog analysis/import phase after the existing storefront's price data is inspected. UI display formatting remains separate from canonical stored values.

## Rendering and delivery

- Prefer Server Components, server rendering, streaming, and framework caching.
- Add Client Components only around interaction that requires browser state.
- Keep canonical metadata, semantic hierarchy, robots, and sitemap generation in the App Router.
- Preserve responsive-image sizing and stable layout dimensions when media arrives.
- Do not introduce platform-specific deployment assumptions into domain or design-token packages.

## PWA readiness

The structure must remain compatible with a future web manifest, installability, standalone display, and mobile home-screen installation. A service worker and offline commerce behavior are intentionally absent until their requirements are defined.

## Animation hierarchy

1. CSS and the Web Animations API for hover, opacity, transform, and simple transitions.
2. A React motion library only for justified interactive layouts, menus, drawers, or component transitions.
3. Lazy-loaded GSAP only for a specific cinematic hero, campaign, or intro sequence.
4. WebGL/Three.js only for a compelling, isolated visual experience; never as a default or critical-path dependency.
