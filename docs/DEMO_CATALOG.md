# Demo catalog

The checked-in demo snapshot comes from the client-owned public website [boofchi.ir](https://boofchi.ir/) and is generated from the public WooCommerce Store API. Runtime development and production builds read only local JSON and media; they do not require the source website to be online.

## Snapshot summary

- Selected products: **96** from 966 public products observed
- Categories: **47** source categories; 45 appear as a selected product's deepest primary category
- Universes: **8**
- Fandoms: **0** (no reliable source taxonomy)
- Products mapped to a universe: **14**
- Unclassified products: **82**
- Characters: **0**
- Collections: **0**
- In-stock / out-of-stock selected products: **78 / 18**
- Primary product images: **96**
- Additional gallery images: **18** across a maximum 16 showcase products
- Official logo assets: **1**
- Optional public store/brand photographs: **5**
- Committed media size: **8,473,605 bytes (8.08 MiB)**
- Normalized descriptions: **81** selected products

## Sampling strategy

The first six valid Store API products were retained because they matched the six products visibly highlighted on the homepage at extraction time. Remaining slots use a deterministic, in-stock-first round-robin across each product's deepest real source category. This produces broad coverage without allowing figures, keychains, apparel, decor, or another large category to dominate.

Universe assignment uses a small explicit phrase table only. It recognized real selected titles for `Berserk`, `GTA`, `Harry Potter`, `Jujutsu Kaisen`, `One Piece`, `Spider-Man`, `Batman`, and `The Last of Us`. No fuzzy or AI-generated classification is used.

## Money policy

Source and visible-price evidence proves that the raw integers are Toman values with no scale conversion. The canonical demo representation is `{ amount: integer, unit: "TOMAN" }`. Floating-point monetary values are invalid, and display formatting remains outside stored data.

## Commands

```bash
pnpm catalog:audit
pnpm catalog:import
pnpm catalog:validate
```

`catalog:import` is the only normal command that downloads catalog/media data. It uses bounded pagination, sequential API requests, two concurrent media workers, timeouts, and small retry/backoff limits. Stable source IDs produce stable entity IDs and media filenames.

## Known limitations

- The public catalog is live; rerunning the importer later may legitimately change product availability, descriptions, imagery, selection, and snapshot timestamp.
- No public SKU or exact stock quantity was available. Availability is semantic only.
- Descriptions are source-faithful plain text; WordPress layout HTML is intentionally discarded.
- Only the current price and genuine lower sale price (when present) are modeled. Reviews, ratings, sales counts, attributes, variations, tags, and source UI markup are not imported.
- Product image originals remain traceable only in `source-manifest.json`; runtime records use local optimized WebP paths.
- Fandom, character, and collection files are intentionally empty until reliable source data or an approved merchandising taxonomy exists.
