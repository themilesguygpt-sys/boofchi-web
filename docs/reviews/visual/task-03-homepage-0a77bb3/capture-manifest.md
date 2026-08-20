# Capture manifest

## Source

- Source URL: <https://boofchi-web.themilesguygpt.workers.dev/>
- Git SHA: `0a77bb367d544b7b953b6260eac94a5983dfd227`
- Cloudflare Worker: `boofchi-web`
- Cloudflare build: `1bc2baf8-741d-4489-87d1-99d506e38e24` (`success`)
- Cloudflare deployment: `5aa1fe3b-d26c-4c3b-b556-7f8d2600b30b`
- Cloudflare version: `5373c26a-3e09-4b79-adeb-6e59f93cea02` at 100%
- Capture date: `2026-08-21T02:35:32+03:30`
- Browser: Codex in-app browser (Chromium), zoom 100%
- Runtime verification: homepage returned HTTP 200; the matching Worker version recorded outcome `ok`.

## Viewports and files

The browser viewport was verified in page state before capture. Browser screenshot export omits native scrollbar gutters in some static rasters, so those raster dimensions are also recorded below.

| File | Browser viewport | Raster | State and purpose |
| --- | --- | --- | --- |
| [desktop-full.webp](screenshots/desktop-full.webp) | 1440 × 900 | 1424 × 7567 | Full live desktop homepage from announcement bar through footer. |
| [desktop-hero.webp](screenshots/desktop-hero.webp) | 1440 × 900 | 1425 × 891 | Top-of-page desktop hero, header, primary actions, and hero product composition. |
| [desktop-catalog.webp](screenshots/desktop-catalog.webp) | 1440 × 900 | 1424 × 3210 | Continuous crop of the live full-page capture from discovery shortcuts through featured products, universes, and categories. |
| [desktop-story-collector.webp](screenshots/desktop-story-collector.webp) | 1440 × 900 | 1424 × 2497 | Continuous crop covering the physical-store story, discovery products, and collector section. |
| [desktop-footer.webp](screenshots/desktop-footer.webp) | 1440 × 900 | 1424 × 967 | Closing call to action and complete desktop footer. |
| [interaction-desktop.webp](screenshots/interaction-desktop.webp) | 1440 × 900 | 1425 × 891 | First featured product card in its real pointer-hover state. |
| [mobile-full.webp](screenshots/mobile-full.webp) | 390 × 844 | 375 × 7800 | Full live mobile homepage from announcement bar through footer. |
| [mobile-hero.webp](screenshots/mobile-hero.webp) | 390 × 844 | 375 × 811 | Top-of-page mobile hero, compact header, actions, and product composition. |
| [mobile-catalog.webp](screenshots/mobile-catalog.webp) | 390 × 844 | 375 × 3062 | Continuous crop from discovery shortcuts through featured products, universes, and categories. |
| [mobile-story-collector.webp](screenshots/mobile-story-collector.webp) | 390 × 844 | 375 × 2555 | Continuous crop covering the store story, discovery products, collector section, and start of closing. |
| [mobile-menu-open.webp](screenshots/mobile-menu-open.webp) | 390 × 844 | 390 × 843 | Real open mobile-menu dialog with backdrop, logo, close control, numbered navigation, and future-feature note. |

## Factual capture notes

- The document reported `lang="fa"` and `dir="rtl"` at both target viewports.
- The site header reported `position: relative`; it did not remain pinned while traversing the page.
- The mobile product rail reported `overflow-x: auto`, `scroll-snap-type: inline mandatory`, a 375 px client width, and a 1544 px scroll width.
- The mobile menu opened as a dialog labelled `منوی اصلی`, filled the viewport height, and left a visible backdrop strip beside the panel. Its close control was present and labelled `بستن منوی اصلی`.
- The desktop interaction capture was taken only after the first featured product card matched the real CSS `:hover` state.
- Fonts reported `loaded` before capture. All 34 desktop images loaded after normal page traversal. On mobile, all visible and important images loaded; two horizontally off-screen lazy images remained deferred.
- The live hero includes one existing CSS `hero-float` animation with a 7-second infinite cycle. No dedicated motion recording was necessary for this static review package.
- No obvious loading shift or runtime failure remained after the page, fonts, and visible imagery stabilized.
- The long full-page captures preserve native sticky-section behavior. Sticky content can therefore appear more than once in a continuous full-page raster; focused captures remain available for direct review.
