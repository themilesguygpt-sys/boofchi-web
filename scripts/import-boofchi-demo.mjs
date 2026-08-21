import { mkdir, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import sharp from "sharp";

import {
  GALLERY_PRODUCT_COUNT,
  HOMEPAGE_PRIORITY_COUNT,
  MONEY_UNIT,
  decodeSourceSlug,
  matchUniverse,
  normalizeMoney,
  normalizeText,
  selectRepresentativeProducts,
  universeRules,
} from "./lib/catalog-normalization.mjs";
import {
  CATEGORIES_ENDPOINT,
  PRODUCTS_ENDPOINT,
  SITEMAP_INDEX,
  SOURCE_SITE,
  WORDPRESS_API,
  fetchAllCategories,
  fetchAllProducts,
  fetchPublic,
  mapWithConcurrency,
} from "./lib/boofchi-source.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const dataDirectory = path.join(repositoryRoot, "apps", "web", "src", "data", "demo");
const productMediaDirectory = path.join(repositoryRoot, "apps", "web", "public", "media", "products");
const brandMediaDirectory = path.join(repositoryRoot, "apps", "web", "public", "media", "brand");
const storeMediaDirectory = path.join(brandMediaDirectory, "store");

const brandSources = [
  {
    id: "boofchi-logo",
    kind: "logo",
    sourceUrl: "https://boofchi.ir/wp-content/uploads/2025/10/logo-boofchi.png",
    localPath: "/media/brand/boofchi-logo.png",
  },
  ...[
    "https://boofchi.ir/wp-content/uploads/2025/11/DSC09743-scaled.jpg",
    "https://boofchi.ir/wp-content/uploads/2025/11/IMG_1327-scaled.jpg",
    "https://boofchi.ir/wp-content/uploads/2025/11/DSC09734-scaled.jpg",
    "https://boofchi.ir/wp-content/uploads/2025/11/DSC09754-scaled.jpg",
    "https://boofchi.ir/wp-content/uploads/2025/11/DSC09758-scaled.jpg",
  ].map((sourceUrl, index) => ({
    id: `boofchi-store-${index + 1}`,
    kind: "store-photo",
    sourceUrl,
    localPath: `/media/brand/store/boofchi-store-${index + 1}.webp`,
  })),
];

function publicPathToFile(localPath) {
  return path.join(repositoryRoot, "apps", "web", "public", ...localPath.split("/").filter(Boolean));
}

async function writeJson(fileName, value) {
  await writeFile(path.join(dataDirectory, fileName), `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

async function processWebp(sourceUrl, destination, options = {}) {
  const response = await fetchPublic(sourceUrl);
  const input = Buffer.from(await response.arrayBuffer());
  const { data, info } = await sharp(input, { failOn: "warning" })
    .rotate()
    .resize({
      width: options.maxWidth ?? 1_200,
      height: options.maxHeight ?? 1_200,
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: options.quality ?? 82, effort: 4 })
    .toBuffer({ resolveWithObject: true });
  await writeFile(destination, data);
  return { width: info.width, height: info.height, bytes: data.length };
}

const [{ products: sourceProducts, total: observedProductCount }, { categories: sourceCategories }] =
  await Promise.all([fetchAllProducts(), fetchAllCategories()]);

const sourceCurrencyCodes = [...new Set(sourceProducts.map((product) => product.prices.currency_code))];
const sourceMinorUnits = [...new Set(sourceProducts.map((product) => product.prices.currency_minor_unit))];
if (sourceCurrencyCodes.length !== 1 || sourceCurrencyCodes[0] !== "IRT" || sourceMinorUnits.length !== 1 || sourceMinorUnits[0] !== 0) {
  throw new Error(`Unexpected source money metadata: ${sourceCurrencyCodes.join(", ")}.`);
}

const selected = selectRepresentativeProducts(sourceProducts, sourceCategories);
const galleryProductIds = new Set(
  selected
    .filter((product) => product.images.length > 1)
    .slice(0, GALLERY_PRODUCT_COUNT)
    .map((product) => product.id),
);
await Promise.all([
  mkdir(dataDirectory, { recursive: true }),
  mkdir(productMediaDirectory, { recursive: true }),
  mkdir(storeMediaDirectory, { recursive: true }),
]);

console.log(`Downloading and normalizing media for ${selected.length} products...`);
const normalizedProducts = await mapWithConcurrency(selected, 2, async (product, productIndex) => {
  const sourceImages = galleryProductIds.has(product.id) ? product.images.slice(0, 3) : product.images.slice(0, 1);
  const images = [];

  for (const [imageIndex, sourceImage] of sourceImages.entries()) {
    const role = imageIndex === 0 ? "primary" : `gallery-${imageIndex}`;
    const fileName = `product-${product.id}-${role}.webp`;
    const localPath = `/media/products/${fileName}`;
    const dimensions = await processWebp(sourceImage.src, path.join(productMediaDirectory, fileName));
    images.push({
      id: `product-image-${sourceImage.id}`,
      path: localPath,
      alt: normalizeText(sourceImage.alt) || normalizeText(product.name),
      width: dimensions.width,
      height: dimensions.height,
      primary: imageIndex === 0,
    });
  }

  const title = normalizeText(product.name);
  const universe = matchUniverse(title);
  const regularAmount = Number(product.prices.regular_price);
  const saleAmount = Number(product.prices.sale_price);
  const hasSale = Number.isSafeInteger(regularAmount) && Number.isSafeInteger(saleAmount) && saleAmount < regularAmount;
  const shortDescription = normalizeText(product.short_description);
  const description = normalizeText(product.description);

  console.log(`[${productIndex + 1}/${selected.length}] ${product.id} ${title}`);
  return {
    id: `product-${product.id}`,
    slug: decodeSourceSlug(product.slug),
    title: { fa: title },
    ...(shortDescription ? { shortDescription } : {}),
    ...(description ? { description } : {}),
    categoryId: `category-${product.primarySourceCategory.id}`,
    ...(universe ? { universeId: universe.id } : {}),
    fandomIds: [],
    characterIds: [],
    collectionIds: [],
    price: normalizeMoney(product.prices.price),
    ...(hasSale ? { regularPrice: normalizeMoney(product.prices.regular_price) } : {}),
    ...(hasSale ? { salePrice: normalizeMoney(product.prices.sale_price) } : {}),
    availability: product.is_in_stock ? "in-stock" : "out-of-stock",
    images,
    ...(normalizeText(product.sku) ? { sku: normalizeText(product.sku) } : {}),
    sourceUrl: product.permalink,
  };
});

console.log("Downloading official brand assets...");
const normalizedBrandAssets = [];
for (const asset of brandSources) {
  const destination = publicPathToFile(asset.localPath);
  if (asset.kind === "logo") {
    const response = await fetchPublic(asset.sourceUrl);
    const data = Buffer.from(await response.arrayBuffer());
    const metadata = await sharp(data).metadata();
    await writeFile(destination, data);
    normalizedBrandAssets.push({ ...asset, width: metadata.width, height: metadata.height, bytes: data.length });
  } else {
    const metadata = await processWebp(asset.sourceUrl, destination, {
      maxWidth: 1_600,
      maxHeight: 1_600,
      quality: 82,
    });
    normalizedBrandAssets.push({ ...asset, ...metadata });
  }
}

const categories = sourceCategories.map((category) => ({
  id: `category-${category.id}`,
  slug: decodeSourceSlug(category.slug),
  name: { fa: normalizeText(category.name) },
  ...(category.parent ? { parentId: `category-${category.parent}` } : {}),
}));

const usedUniverseIds = new Set(normalizedProducts.flatMap((product) => (product.universeId ? [product.universeId] : [])));
const universes = universeRules
  .filter((universe) => usedUniverseIds.has(universe.id))
  .map((universe) => ({ id: universe.id, slug: universe.slug, name: { fa: universe.name, en: universe.name } }));
const emptyEntities = [];
const importedAt = new Date().toISOString();

const sourceManifest = {
  schemaVersion: 1,
  sourceWebsite: SOURCE_SITE,
  importedAt,
  endpoints: {
    products: PRODUCTS_ENDPOINT,
    categories: CATEGORIES_ENDPOINT,
    wordpress: WORDPRESS_API,
    sitemap: SITEMAP_INDEX,
  },
  sourceCounts: { products: observedProductCount, categories: sourceCategories.length },
  products: selected.map((product) => ({
    id: `product-${product.id}`,
    sourceId: Number(product.id),
    sourceSlug: product.slug,
    sourceUrl: product.permalink,
    sourceCategoryIds: product.categories.map((category) => Number(category.id)),
    originalImages: (galleryProductIds.has(product.id) ? product.images.slice(0, 3) : product.images.slice(0, 1)).map(
      (image) => image.src,
    ),
  })),
  categories: sourceCategories.map((category) => ({
    id: `category-${category.id}`,
    sourceId: Number(category.id),
    sourceSlug: category.slug,
  })),
  brandAssets: normalizedBrandAssets,
};

const productImageCount = normalizedProducts.reduce((total, product) => total + product.images.length, 0);
const primaryImageCount = normalizedProducts.length;
const galleryImageCount = productImageCount - primaryImageCount;
const mappedProductCount = normalizedProducts.filter((product) => product.universeId).length;
const mediaFiles = [
  ...normalizedProducts.flatMap((product) => product.images.map((image) => publicPathToFile(image.path))),
  ...normalizedBrandAssets.map((asset) => publicPathToFile(asset.localPath)),
];
let mediaBytes = 0;
for (const file of mediaFiles) {
  mediaBytes += (await stat(file)).size;
}

const catalogMeta = {
  schemaVersion: 1,
  sourceWebsite: SOURCE_SITE,
  importedAt,
  observedPublicProductCount: observedProductCount,
  selectedProductCount: normalizedProducts.length,
  categoryCount: categories.length,
  universeCount: universes.length,
  fandomCount: 0,
  productsMappedToUniverse: mappedProductCount,
  unclassifiedProductCount: normalizedProducts.length - mappedProductCount,
  characterCount: 0,
  collectionCount: 0,
  primaryImageCount,
  galleryImageCount,
  brandAssetCount: normalizedBrandAssets.filter((asset) => asset.kind === "logo").length,
  storePhotoCount: normalizedBrandAssets.filter((asset) => asset.kind === "store-photo").length,
  mediaBytes,
  moneyUnit: MONEY_UNIT,
  selectionStrategy: `First ${HOMEPAGE_PRIORITY_COUNT} homepage-aligned Store API products, then in-stock-first round-robin selection across deepest source categories.`,
};

await Promise.all([
  writeJson("products.json", normalizedProducts),
  writeJson("product-ids.json", normalizedProducts.map((product) => product.id)),
  writeJson("categories.json", categories),
  writeJson("universes.json", universes),
  writeJson("fandoms.json", emptyEntities),
  writeJson("characters.json", emptyEntities),
  writeJson("collections.json", emptyEntities),
  writeJson("catalog-meta.json", catalogMeta),
  writeJson("source-manifest.json", sourceManifest),
]);

console.log(JSON.stringify(catalogMeta, null, 2));
