import { access, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { normalizeText } from "./lib/catalog-normalization.mjs";
import {
  CATEGORIES_ENDPOINT,
  PRODUCTS_ENDPOINT,
  SITEMAP_INDEX,
  SOURCE_SITE,
  WORDPRESS_API,
  delay,
  fetchJson,
  fetchText,
} from "./lib/boofchi-source.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const dataDirectory = path.join(repositoryRoot, "apps", "web", "src", "data", "demo");

const wordpress = await fetchJson(WORDPRESS_API);
await delay(250);
const products = await fetchJson(`${PRODUCTS_ENDPOINT}?per_page=5&page=1`);
await delay(250);
const categories = await fetchJson(`${CATEGORIES_ENDPOINT}?per_page=100`);
await delay(250);
const sitemap = await fetchText(SITEMAP_INDEX);

const report = {
  auditedAt: new Date().toISOString(),
  source: SOURCE_SITE,
  endpoints: {
    wordpress: WORDPRESS_API,
    products: PRODUCTS_ENDPOINT,
    categories: CATEGORIES_ENDPOINT,
    sitemap: SITEMAP_INDEX,
  },
  storeApiAvailable: wordpress.data.namespaces?.includes("wc/store/v1") ?? false,
  publicProductCount: Number(products.headers.get("x-wp-total")),
  publicCategoryCount:
    categories.headers.get("x-wp-total") === null
      ? categories.data.length
      : Number(categories.headers.get("x-wp-total")),
  sitemapProductFiles: [...sitemap.data.matchAll(/<loc>(https:\/\/boofchi\.ir\/product-sitemap\d+\.xml)<\/loc>/g)].map(
    (match) => match[1],
  ),
  priceSamples: products.data.map((product) => ({
    id: product.id,
    title: normalizeText(product.name),
    rawPrice: product.prices.price,
    currencyCode: product.prices.currency_code,
    currencySymbol: product.prices.currency_symbol,
    minorUnit: product.prices.currency_minor_unit,
    sourceUrl: product.permalink,
  })),
};

try {
  await access(path.join(dataDirectory, "products.json"));
  const [localProducts, sourceManifest] = await Promise.all([
    readFile(path.join(dataDirectory, "products.json"), "utf8").then(JSON.parse),
    readFile(path.join(dataDirectory, "source-manifest.json"), "utf8").then(JSON.parse),
  ]);
  const manifestById = new Map(sourceManifest.products.map((product) => [product.id, product]));
  const sampleIndexes = Array.from({ length: 10 }, (_, index) =>
    Math.floor((index * (localProducts.length - 1)) / 9),
  );
  const comparisons = [];

  for (const index of sampleIndexes) {
    const local = localProducts[index];
    const provenance = manifestById.get(local.id);
    await delay(250);
    const remote = (await fetchJson(`${PRODUCTS_ENDPOINT}/${provenance.sourceId}`)).data;
    const sourceCategoryIds = remote.categories.map((category) => Number(category.id)).sort((a, b) => a - b);
    const expectedCategoryIds = [...provenance.sourceCategoryIds].sort((a, b) => a - b);
    const checks = {
      title: local.title.fa === normalizeText(remote.name),
      price: local.price.amount === Number(remote.prices.price),
      primaryImage: provenance.originalImages[0] === remote.images[0]?.src,
      categories: JSON.stringify(sourceCategoryIds) === JSON.stringify(expectedCategoryIds),
      sourceUrl: local.sourceUrl === remote.permalink,
      availability:
        local.availability === (remote.is_in_stock ? "in-stock" : "out-of-stock"),
    };
    comparisons.push({ id: local.id, sourceId: provenance.sourceId, title: local.title.fa, checks });
  }

  report.snapshotComparison = {
    sampleSize: comparisons.length,
    passed: comparisons.every((comparison) => Object.values(comparison.checks).every(Boolean)),
    products: comparisons,
  };

  if (!report.snapshotComparison.passed) {
    console.error(JSON.stringify(report, null, 2));
    process.exitCode = 1;
  }
} catch (error) {
  if (error?.code !== "ENOENT") {
    throw error;
  }
  report.snapshotComparison = { skipped: "No local snapshot exists yet." };
}

console.log(JSON.stringify(report, null, 2));
