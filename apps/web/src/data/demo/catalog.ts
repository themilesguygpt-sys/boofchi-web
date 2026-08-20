import type {
  CatalogDataSource,
  Category,
  Character,
  Collection,
  Fandom,
  Product,
  ProductQuery,
  ProductSort,
  Universe,
} from "@boofchi/contracts";

import categoriesData from "./categories.json";
import charactersData from "./characters.json";
import collectionsData from "./collections.json";
import fandomsData from "./fandoms.json";
import productsData from "./products.json";
import universesData from "./universes.json";

const products = productsData as Product[];
const categories = categoriesData as Category[];
const universes = universesData as Universe[];
const fandoms = fandomsData as Fandom[];
const characters = charactersData as Character[];
const collections = collectionsData as Collection[];
const productOrder = new Map(products.map((product, index) => [product.id, index]));
const nameCollator = new Intl.Collator("fa", { sensitivity: "base" });

function includesSearch(product: Product, search: string): boolean {
  const normalizedSearch = search.trim().toLocaleLowerCase("fa");
  return [product.title.fa, product.title.en, product.sku]
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLocaleLowerCase("fa").includes(normalizedSearch));
}

function descendantCategoryIds(categoryId: string): Set<string> {
  const ids = new Set([categoryId]);
  let changed = true;

  while (changed) {
    changed = false;
    for (const category of categories) {
      if (category.parentId && ids.has(category.parentId) && !ids.has(category.id)) {
        ids.add(category.id);
        changed = true;
      }
    }
  }

  return ids;
}

function sortProducts(items: readonly Product[], sort: ProductSort = "default"): Product[] {
  return [...items].sort((left, right) => {
    if (sort === "price-asc") return left.price.amount - right.price.amount;
    if (sort === "price-desc") return right.price.amount - left.price.amount;
    if (sort === "name") return nameCollator.compare(left.title.fa, right.title.fa);
    return (productOrder.get(left.id) ?? 0) - (productOrder.get(right.id) ?? 0);
  });
}

function filterProducts(query: ProductQuery): Product[] {
  const categoryIds = query.categoryId ? descendantCategoryIds(query.categoryId) : null;
  const filtered = products.filter(
    (product) =>
      (!categoryIds || categoryIds.has(product.categoryId)) &&
      (!query.universeId || product.universeId === query.universeId) &&
      (!query.availability || product.availability === query.availability) &&
      (!query.fandomId || product.fandomIds.includes(query.fandomId)) &&
      (!query.collectionId || product.collectionIds.includes(query.collectionId)) &&
      (!query.search || includesSearch(product, query.search)),
  );

  return sortProducts(filtered, query.sort);
}

function withoutPagination(query: ProductQuery): ProductQuery {
  const rest = { ...query };
  delete rest.cursor;
  delete rest.limit;
  return rest;
}

export const demoCatalogDataSource: CatalogDataSource = {
  async getProductBySlug(slug) {
    return products.find((product) => product.slug === slug) ?? null;
  },

  async getCategoryBySlug(slug) {
    return categories.find((category) => category.slug === slug) ?? null;
  },

  async getUniverseBySlug(slug) {
    return universes.find((universe) => universe.slug === slug) ?? null;
  },

  async getRelatedProducts(productSlug, limit = 6) {
    const product = products.find((item) => item.slug === productSlug);
    if (!product) return [];

    const safeLimit = Math.min(Math.max(limit, 1), 12);
    const candidates = products.filter((item) => item.id !== product.id);
    const sameUniverse = product.universeId
      ? candidates.filter((item) => item.universeId === product.universeId)
      : [];
    const sameCategory = candidates.filter(
      (item) =>
        item.categoryId === product.categoryId &&
        !sameUniverse.some((related) => related.id === item.id),
    );
    const ordered = [
      ...sameUniverse,
      ...sameCategory,
      ...candidates.filter(
        (item) =>
          !sameUniverse.some((related) => related.id === item.id) &&
          !sameCategory.some((related) => related.id === item.id),
      ),
    ];

    return [...new Map(ordered.map((item) => [item.id, item])).values()].slice(0, safeLimit);
  },

  async getAvailableFilters(query = {}) {
    const base = withoutPagination(query);
    const categoryBase = filterProducts({ ...base, categoryId: undefined });
    const universeBase = filterProducts({ ...base, universeId: undefined });
    const availabilityBase = filterProducts({ ...base, availability: undefined });

    return {
      categories: categories.flatMap((category) => {
        const ids = descendantCategoryIds(category.id);
        const count = categoryBase.filter((product) => ids.has(product.categoryId)).length;
        return count > 0 ? [{ category, count }] : [];
      }),
      universes: universes.flatMap((universe) => {
        const count = universeBase.filter((product) => product.universeId === universe.id).length;
        return count > 0 ? [{ universe, count }] : [];
      }),
      availability: (["in-stock", "out-of-stock", "unknown"] as const).flatMap(
        (availability) => {
          const count = availabilityBase.filter(
            (product) => product.availability === availability,
          ).length;
          return count > 0 ? [{ availability, count }] : [];
        },
      ),
    };
  },

  async listProducts(query = {}) {
    const filtered = filterProducts(query);
    const offset = query.cursor ? Number.parseInt(query.cursor, 10) : 0;
    const safeOffset = Number.isSafeInteger(offset) && offset >= 0 ? offset : 0;
    const limit = Math.min(Math.max(query.limit ?? 24, 1), 100);
    const items = filtered.slice(safeOffset, safeOffset + limit);
    const nextOffset = safeOffset + items.length;

    return {
      items,
      ...(nextOffset < filtered.length ? { nextCursor: String(nextOffset) } : {}),
    };
  },

  async listCategories() {
    return categories;
  },

  async listUniverses() {
    return universes;
  },

  async listFandoms() {
    return fandoms;
  },

  async listCharacters() {
    return characters;
  },

  async listCollections() {
    return collections;
  },
};
