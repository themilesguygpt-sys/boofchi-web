import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(scriptDirectory, "..");
const dataDirectory = path.join(repositoryRoot, "apps", "web", "src", "data", "demo");
const publicDirectory = path.join(repositoryRoot, "apps", "web", "public");
const failures = [];

function assert(condition, message) {
  if (!condition) {
    failures.push(message);
  }
}

async function readJson(fileName) {
  const filePath = path.join(dataDirectory, fileName);
  const text = await readFile(filePath, "utf8");
  assert(text.length < 1_000_000, `${fileName} is unexpectedly large.`);
  return JSON.parse(text);
}

function unique(values, label) {
  assert(new Set(values).size === values.length, `${label} must be unique.`);
}

function validateMoney(money, label) {
  assert(money && Number.isSafeInteger(money.amount), `${label} amount must be a safe integer.`);
  assert(money?.unit === "TOMAN", `${label} unit must be TOMAN.`);
}

const [products, categories, universes, fandoms, characters, collections, meta, manifest] = await Promise.all([
  readJson("products.json"),
  readJson("categories.json"),
  readJson("universes.json"),
  readJson("fandoms.json"),
  readJson("characters.json"),
  readJson("collections.json"),
  readJson("catalog-meta.json"),
  readJson("source-manifest.json"),
]);

assert(products.length === 96, `Expected 96 products, found ${products.length}.`);
unique(products.map((product) => product.id), "Product IDs");
unique(products.map((product) => product.slug), "Product slugs");
unique(categories.map((category) => category.id), "Category IDs");
unique(universes.map((universe) => universe.id), "Universe IDs");
unique(fandoms.map((fandom) => fandom.id), "Fandom IDs");
unique(characters.map((character) => character.id), "Character IDs");
unique(collections.map((collection) => collection.id), "Collection IDs");

const categoryIds = new Set(categories.map((category) => category.id));
const universeIds = new Set(universes.map((universe) => universe.id));
const fandomIds = new Set(fandoms.map((fandom) => fandom.id));
const characterIds = new Set(characters.map((character) => character.id));
const collectionIds = new Set(collections.map((collection) => collection.id));
const manifestById = new Map(manifest.products.map((product) => [product.id, product]));
const imagePaths = [];

for (const category of categories) {
  assert(category.name?.fa?.trim(), `Category ${category.id} must have a Persian name.`);
  assert(!category.parentId || categoryIds.has(category.parentId), `Category ${category.id} has a dangling parent.`);
}

for (const product of products) {
  assert(product.title?.fa?.trim(), `Product ${product.id} must have a non-empty title.`);
  assert(product.slug?.trim(), `Product ${product.id} must have a non-empty slug.`);
  assert(categoryIds.has(product.categoryId), `Product ${product.id} has an invalid category.`);
  assert(!product.universeId || universeIds.has(product.universeId), `Product ${product.id} has an invalid universe.`);
  product.fandomIds.forEach((id) => assert(fandomIds.has(id), `Product ${product.id} has invalid fandom ${id}.`));
  product.characterIds.forEach((id) => assert(characterIds.has(id), `Product ${product.id} has invalid character ${id}.`));
  product.collectionIds.forEach((id) => assert(collectionIds.has(id), `Product ${product.id} has invalid collection ${id}.`));
  assert(/^https:\/\/boofchi\.ir\/product\//.test(product.sourceUrl), `Product ${product.id} has an invalid source URL.`);
  assert(["in-stock", "out-of-stock", "unknown"].includes(product.availability), `Product ${product.id} availability is invalid.`);
  validateMoney(product.price, `Product ${product.id} price`);
  if (product.regularPrice) validateMoney(product.regularPrice, `Product ${product.id} regular price`);
  if (product.salePrice) validateMoney(product.salePrice, `Product ${product.id} sale price`);
  assert(Array.isArray(product.images) && product.images.length >= 1, `Product ${product.id} needs an image.`);
  assert(product.images.filter((image) => image.primary).length === 1, `Product ${product.id} needs exactly one primary image.`);

  for (const image of product.images) {
    assert(image.path.startsWith("/media/products/"), `Product ${product.id} image must be local.`);
    assert(!/^https?:/i.test(image.path), `Product ${product.id} image cannot be a hotlink.`);
    assert(Number.isInteger(image.width) && image.width > 0, `Image ${image.id} width is invalid.`);
    assert(Number.isInteger(image.height) && image.height > 0, `Image ${image.id} height is invalid.`);
    imagePaths.push(image.path);
    await access(path.join(publicDirectory, ...image.path.split("/").filter(Boolean)));
  }

  const provenance = manifestById.get(product.id);
  assert(provenance, `Product ${product.id} is missing provenance.`);
  assert(provenance?.sourceId && provenance?.sourceSlug, `Product ${product.id} provenance is incomplete.`);
  assert(
    provenance?.originalImages?.every((url) => /^https:\/\/boofchi\.ir\/wp-content\//.test(url)),
    `Product ${product.id} original image provenance is invalid.`,
  );
}

unique(imagePaths, "Local product image paths");
assert(manifest.products.length === products.length, "Manifest product count must match the catalog.");
assert(meta.selectedProductCount === products.length, "Catalog metadata product count is stale.");
assert(meta.categoryCount === categories.length, "Catalog metadata category count is stale.");
assert(meta.universeCount === universes.length, "Catalog metadata universe count is stale.");
assert(meta.moneyUnit === "TOMAN", "Catalog metadata money unit must be TOMAN.");

let mediaBytes = 0;
for (const localPath of [
  ...imagePaths,
  ...manifest.brandAssets.map((asset) => asset.localPath),
]) {
  const filePath = path.join(publicDirectory, ...localPath.split("/").filter(Boolean));
  await access(filePath);
  mediaBytes += (await stat(filePath)).size;
}
assert(mediaBytes === meta.mediaBytes, "Catalog metadata media size is stale.");

if (failures.length > 0) {
  console.error(`Demo catalog validation failed (${failures.length}):`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(
  `Demo catalog valid: ${products.length} products, ${categories.length} categories, ${universes.length} universes, ${imagePaths.length} product images, ${(mediaBytes / 1_048_576).toFixed(2)} MiB media.`,
);
