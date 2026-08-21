# Capture manifest

## Source

- Source URL: <https://boofchi-web.themilesguygpt.workers.dev/>
- Git SHA: `8ee6ffc53e279678aa26886155285bdac13d5789`
- Cloudflare Worker: `boofchi-web`
- Cloudflare build: `d72313e6-96b2-4183-87d3-8fdd3c528566` (`success`)
- Cloudflare deployment: `1d784dd8-1953-4a04-b3c5-7ce9c7b06883`
- Cloudflare version: `2098ef90-44fa-469f-8648-1ea7d6c70f6f` at 100%
- Capture date: `2026-08-21T03:35:17+03:30`
- Browser: Codex in-app browser (Chromium), zoom 100%
- Runtime verification: representative live routes returned HTTP 200, an unknown product returned HTTP 404, and the deployed Worker version recorded outcome `ok` with no error-level telemetry.

## Viewports and files

The browser viewport was set before every capture. Browser screenshot export omits native scrollbar gutters in some static rasters, so actual raster dimensions are recorded below.

| File | Browser viewport | Raster | State and purpose |
| --- | --- | --- | --- |
| [homepage-desktop.webp](screenshots/homepage-desktop.webp) | 1440 × 900 | 1425 × 891 | Live Homepage comparison after commerce cards, CTAs, and navigation became real links. |
| [shop-desktop.webp](screenshots/shop-desktop.webp) | 1440 × 900 | 1425 × 891 | Default 96-product Shop with desktop filter sidebar, sort, count, and four-column catalog view. |
| [shop-mobile.webp](screenshots/shop-mobile.webp) | 390 × 844 | 375 × 811 | Default Shop at the compact two-column mobile layout. |
| [shop-filter-desktop.webp](screenshots/shop-filter-desktop.webp) | 1440 × 900 | 1425 × 891 | Composed `the-key` + in-stock filters with ascending price sort and three truthful results. |
| [shop-filter-mobile-open.webp](screenshots/shop-filter-mobile-open.webp) | 390 × 844 | 390 × 843 | Accessible filter dialog open with two applied filters, real facet counts, clear action, and result action. |
| [category-desktop.webp](screenshots/category-desktop.webp) | 1440 × 900 | 1425 × 891 | Real `the-key` category route, result count, sort, and five-product grid. |
| [category-mobile.webp](screenshots/category-mobile.webp) | 390 × 844 | 375 × 811 | Real `the-key` category at the mobile breakpoint. |
| [universe-desktop.webp](screenshots/universe-desktop.webp) | 1440 × 900 | 1425 × 891 | Real `harry-potter` universe route with three mapped products. |
| [universe-mobile.webp](screenshots/universe-mobile.webp) | 390 × 844 | 375 × 811 | Real `harry-potter` universe at the mobile breakpoint. |
| [product-desktop.webp](screenshots/product-desktop.webp) | 1440 × 900 | 1425 × 891 | Multi-image in-stock PDP with real TOMAN price, availability, taxonomy, and staged cart action. |
| [product-mobile.webp](screenshots/product-mobile.webp) | 390 × 844 | 375 × 811 | Multi-image PDP default gallery state at the mobile breakpoint. |
| [product-gallery-state.webp](screenshots/product-gallery-state.webp) | 390 × 844 | 375 × 811 | Same PDP after keyboard-accessible selection of image 2; selected thumbnail remains visibly pressed. |
| [product-card-hover.webp](screenshots/product-card-hover.webp) | 1440 × 900 | 1425 × 891 | Live first product card in its real pointer-hover state, showing the clearer violet border and image treatment. |

## Contact sheet

- File: [visual-review-contact-sheet.jpg](visual-review-contact-sheet.jpg)
- Raster: 2400 × 7276
- Size: 887,381 bytes
- Composition: generated only from the screenshots listed above, grouped as Home, Shop, Category, Universe, Product, Mobile, and Interaction.

## Factual capture notes

- Every focused page reported `lang="fa"` and `dir="rtl"`.
- Every reviewed desktop and mobile route reported zero horizontal document overflow.
- All visible images loaded successfully; the browser console reported no warnings or errors after the live capture pass.
- The mobile filter opened as a dialog labelled `فیلتر محصولات`, moved focus to `بستن فیلترها`, locked body scrolling, closed with Escape, and restored focus to the trigger during QA.
- The product gallery changed from the primary image to the second real local image and reported `aria-pressed="true"` on the selected thumbnail.
- Product-card hover evidence was captured only after the pointer was moved onto the real linked card.
- Product image URLs resolve through the deployed Next.js image pipeline and do not depend on `boofchi.ir` at runtime.
