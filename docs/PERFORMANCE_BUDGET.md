# Performance budget

Boofchi is mobile-first and performance-first. Budgets are enforced through practical engineering constraints and real measurement rather than arbitrary numbers detached from representative devices and content.

- Prefer Server Components and server rendering; ship client JavaScript only for required interaction.
- Use responsive, optimized images with explicit dimensions or aspect ratios to prevent layout shift.
- Load below-the-fold and non-critical media lazily; prioritize only genuinely critical imagery.
- Do not autoplay heavy video during the initial critical load.
- Avoid unnecessary third-party scripts, duplicated libraries, and blocking resources.
- Use one carefully subsetted variable font where possible; avoid unnecessary font families, weights, and blocking font requests.
- Animate `transform` and `opacity`; avoid layout-triggering animation where possible.
- Respect `prefers-reduced-motion` and keep essential flows usable without motion.
- Dynamically load justified heavy animation libraries. WebGL requires a specific, compelling reason and must remain isolated from the default path.
- Cache static and public content using framework and CDN semantics appropriate to its update frequency.
- Preserve strong Core Web Vitals by testing representative mobile viewports, realistic content, and production builds.

Review bundle composition, image behavior, font loading, layout stability, and client-component boundaries whenever a feature adds meaningful UI weight.
