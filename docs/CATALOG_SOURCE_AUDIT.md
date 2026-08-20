# Boofchi catalog source audit

Audit date: **2026-08-20**

Source: [https://boofchi.ir/](https://boofchi.ir/)

Only public, unauthenticated endpoints and pages were accessed. No account, cookies, credentials, private WooCommerce API, admin route, or security bypass was used.

## Public sources tested

| Source | Result | Finding |
| --- | --- | --- |
| `/wp-json/` | HTTP 200 | WordPress index exposes `wp/v2` and public `wc/store/v1` namespaces. |
| `/wp-json/wc/store/v1/products` | HTTP 200 | Primary source; 966 public products observed. |
| `/wp-json/wc/store/v1/products/categories` | HTTP 200 | Primary taxonomy source; 47 categories observed. |
| `/wp-json/wp/v2/product` | HTTP 200 | Public fallback; also reported 966 products. |
| `/sitemap_index.xml` | HTTP 200 | Rank Math index with five product sitemaps and one product-category sitemap. |
| `/product-sitemap1.xml` through `/product-sitemap5.xml` | HTTP 200 | 1,000 product URL entries total; more than the current API count. |
| `/product_cat-sitemap.xml` | HTTP 200 | 47 category URL entries. |
| `/robots.txt` | HTTP 200 | Sitemap declared; admin and private WooCommerce upload/log paths disallowed. |
| Homepage and five representative product pages | HTTP 200 | Used for homepage prominence, visible price, logo, and brand-media checks. |

The selected source hierarchy is:

1. WooCommerce Store API for products, prices, availability, categories, descriptions, and media provenance.
2. WordPress product REST endpoint and XML sitemaps as discovery/traceability fallbacks.
3. Public homepage and product HTML only for visible-price and brand-asset confirmation.

No required public source was blocked. The generic web reader intermittently timed out on individual pages, but bounded direct HTTP GET requests succeeded; this was a client/network behavior, not a bypass or access-control issue.

## Data representation

- **Identifiers:** numeric public product/category IDs; internal snapshot IDs are stable `product-<id>` and `category-<id>` values.
- **Slugs:** API slugs are often percent-encoded and are decoded to ordinary Unicode for the runtime snapshot. Original encoded slugs remain in the source manifest.
- **Titles:** public `name` strings are Persian or mixed Persian/English; occasional HTML entities are decoded without rewriting the title.
- **Prices:** decimal digit strings with zero minor units. All 966 observed products declared source currency code `IRT`, symbol `تومان`, and suffix ` تومان`.
- **Stock:** public `is_in_stock` supports semantic `in-stock`/`out-of-stock`; exact quantities are not exposed and were not inferred.
- **Images:** image objects provide media ID, original URL, thumbnail, `srcset`, name, and optional alt text. Processed dimensions are measured locally.
- **Descriptions:** the Store API returns WordPress/WooCommerce HTML. Genuine text is converted to plain Unicode text using an HTML parser; scripts, styles, image/layout markup, and unsafe HTML are not retained.
- **SKUs:** none of the 966 public product records exposes a non-empty SKU.
- **Permalinks:** each Store API product provides a public `https://boofchi.ir/product/.../` source URL.
- **Categories:** 47 real categories form a three-level maximum hierarchy. Persian labels, source IDs/slugs, and parent relationships are retained; source spelling such as `گردنبد` is preserved rather than silently corrected.

## Money investigation

The Store API value, the product page's own visible price run, the visible label, and product-page structured currency metadata were compared for five products:

| Source ID | Product | API raw price | Visible product price | API metadata | Page structured metadata | Scale difference |
| ---: | --- | ---: | ---: | --- | --- | ---: |
| 5074 | سرکلیدی GTA | 580000 | 580,000 تومان | `IRT`, تومان, minor unit 0 | `priceCurrency: IRT` | none |
| 5235 | گردنبند The Last Of US | 680000 | 680,000 تومان | `IRT`, تومان, minor unit 0 | `priceCurrency: IRT` | none |
| 3337 | سرکلیدی One Piece | 520000 | 520,000 تومان | `IRT`, تومان, minor unit 0 | `priceCurrency: IRT` | none |
| 5065 | سرکلیدی Berserk | 520000 | 520,000 تومان | `IRT`, تومان, minor unit 0 | `priceCurrency: IRT` | none |
| 8907 | ماکت اسلحه فلزی08 | 1380000 | 1,380,000 تومان | `IRT`, تومان, minor unit 0 | `priceCurrency: IRT` | none |

Evidence is unambiguous for the demo snapshot: raw integer values are already Toman values and are not Rial values requiring division by ten. The internal contract therefore uses the explicit semantic unit `TOMAN`. `IRT` remains recorded only as source-system evidence; display grouping, Persian digits, and the `تومان` label remain UI formatting concerns.

## Source inconsistencies and limitations

- The five product sitemaps contain 1,000 entries while both public product APIs reported 966 current products; the Store API is authoritative for this snapshot.
- Category `count` values can differ slightly from membership observed during a live paginated fetch, likely because the production catalog changes over time or WooCommerce applies visibility rules.
- Source slugs mix English, percent-encoded Persian, spelling variants, and historical names.
- Only one product exposes a non-empty short description; 747 of 966 expose a description.
- Exact inventory quantity, canonical internal WordPress storage configuration, private cost data, orders, customers, and admin-only fields are unavailable publicly and were not accessed.
- The site has no clean public universe, fandom, or character taxonomy. Only deterministic title-phrase universe matches are added; uncertain products remain unclassified.
- Tags, brands, attributes, variations, ratings, review counts, sales counts, and low-stock signals are intentionally not mirrored into the small runtime contract.
