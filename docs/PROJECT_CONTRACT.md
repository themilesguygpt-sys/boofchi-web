# Boofchi project contract

These rules are permanent defaults for every project phase. A task may narrow the scope further but must not silently contradict this contract.

## Language and direction

- Boofchi is Persian-first and RTL correctness is mandatory.
- English is welcome where it accurately represents names, brands, and technical terms.
- Mixed Persian-English content must follow `RTL_BIDI_RULES.md` and use local BiDi isolation.

## Performance

- Work mobile-first and performance-first; visual richness never justifies poor performance.
- Minimize client-side JavaScript and dependencies. Use Server Components by default.
- Keep heavy animation, video, WebGL, and third-party scripts out of the critical rendering path unless explicitly justified.

## SEO

- Use semantic markup, a logical heading hierarchy, and correct metadata from the beginning.
- Keep product, category, universe, and fandom information crawlable through stable URLs and server-rendered content when those pages are implemented.

## User experience

- Serve a Gen Z and young pop-culture audience with low tolerance for friction.
- Prioritize fast product discovery, clear navigation, and mobile-first interaction.

## Visual direction

- Follow **BOOFCHI — Neon Concrete**: industrial, urban, anime/gaming/pop-culture inspired, and appropriate for premium collectibles.
- Purple is the primary interaction color; Boofchi red is a signature/semantic accent. Cyan is rare.
- Let product imagery lead. Avoid generic cyberpunk styling, indiscriminate neon, and site-wide gradients.

## Accessibility

- Visual effects must not compromise semantics, contrast, keyboard access, visible focus, or a logical heading order.
- Respect `prefers-reduced-motion` and never make animation essential to understanding or completing a task.

## Ethics

Never use fake scarcity, countdowns, reviews, purchase counts, social proof, or deceptive dark patterns.

## Architecture

- Keep UI independent from a specific backend through small, stable contracts.
- Preserve a path for future mobile, admin, CRM, and recommendation systems without implementing them prematurely.
- Begin the commerce backend as a modular monolith. Avoid premature microservices and unnecessary abstraction.
- Prefer maintainability and explicit domain concepts over generic tags or speculative layers.

## React and Next.js

- Use the App Router and Server Components by default.
- Add Client Components only where browser-side interaction is genuinely required.
- Preserve SSR, streaming, caching, app-like navigation, and future PWA capabilities while minimizing browser JavaScript.

## Animation

Use CSS or the Web Animations API first. A React motion library, GSAP, or WebGL requires progressively stronger justification and must not enter the critical rendering path by default.
