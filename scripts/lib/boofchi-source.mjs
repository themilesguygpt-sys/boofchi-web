import dns from "node:dns";

dns.setDefaultResultOrder("ipv4first");

export const SOURCE_SITE = "https://boofchi.ir";
export const STORE_API = `${SOURCE_SITE}/wp-json/wc/store/v1`;
export const PRODUCTS_ENDPOINT = `${STORE_API}/products`;
export const CATEGORIES_ENDPOINT = `${PRODUCTS_ENDPOINT}/categories`;
export const WORDPRESS_API = `${SOURCE_SITE}/wp-json/`;
export const SITEMAP_INDEX = `${SOURCE_SITE}/sitemap_index.xml`;

const USER_AGENT =
  "BoofchiDemoCatalogImporter/1.0 (+https://github.com/themilesguygpt-sys/boofchi-web)";
const RETRYABLE_STATUS = new Set([429, 500, 502, 503, 504]);

export function delay(milliseconds) {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

export async function fetchPublic(url, options = {}) {
  const { attempts = 3, timeoutMs = 30_000 } = options;
  let lastError;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "*/*",
          "User-Agent": USER_AGENT,
        },
        signal: AbortSignal.timeout(timeoutMs),
      });

      if (response.ok) {
        return response;
      }

      const error = new Error(`HTTP ${response.status} for ${url}`);
      if (!RETRYABLE_STATUS.has(response.status) || attempt === attempts) {
        throw error;
      }
      lastError = error;
    } catch (error) {
      lastError = error;
      if (attempt === attempts) {
        break;
      }
    }

    await delay(Math.min(500 * 2 ** (attempt - 1), 2_000));
  }

  throw lastError instanceof Error ? lastError : new Error(`Request failed: ${url}`);
}

export async function fetchJson(url, options) {
  const response = await fetchPublic(url, options);
  return { data: await response.json(), headers: response.headers };
}

export async function fetchText(url, options) {
  const response = await fetchPublic(url, options);
  return { data: await response.text(), headers: response.headers };
}

export async function fetchAllProducts() {
  const first = await fetchJson(`${PRODUCTS_ENDPOINT}?per_page=100&page=1`);
  const total = Number(first.headers.get("x-wp-total"));
  const totalPages = Number(first.headers.get("x-wp-totalpages"));

  if (!Number.isInteger(total) || !Number.isInteger(totalPages) || totalPages < 1 || totalPages > 20) {
    throw new Error("Unexpected Store API pagination metadata.");
  }

  const products = [...first.data];
  for (let page = 2; page <= totalPages; page += 1) {
    await delay(350);
    const response = await fetchJson(`${PRODUCTS_ENDPOINT}?per_page=100&page=${page}`);
    products.push(...response.data);
  }

  if (products.length !== total) {
    throw new Error(`Expected ${total} products, received ${products.length}.`);
  }

  return { products, total, totalPages };
}

export async function fetchAllCategories() {
  const response = await fetchJson(`${CATEGORIES_ENDPOINT}?per_page=100`);
  const totalHeader = response.headers.get("x-wp-total");
  const total = totalHeader === null ? response.data.length : Number(totalHeader);

  if (!Array.isArray(response.data) || response.data.length !== total) {
    throw new Error(`Expected ${total} categories, received ${response.data.length}.`);
  }

  return { categories: response.data, total };
}

export async function mapWithConcurrency(items, concurrency, worker) {
  const results = new Array(items.length);
  let nextIndex = 0;

  async function consume() {
    while (nextIndex < items.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await worker(items[index], index);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, consume));
  return results;
}
