import type {
  CatalogDataSource,
  Category,
  Character,
  Collection,
  Fandom,
  Product,
  ProductQuery,
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

function includesSearch(product: Product, search: string): boolean {
  const normalizedSearch = search.trim().toLocaleLowerCase("fa");
  return [product.title.fa, product.title.en, product.sku]
    .filter((value): value is string => Boolean(value))
    .some((value) => value.toLocaleLowerCase("fa").includes(normalizedSearch));
}

function filterProducts(query: ProductQuery): Product[] {
  return products.filter(
    (product) =>
      (!query.categoryId || product.categoryId === query.categoryId) &&
      (!query.universeId || product.universeId === query.universeId) &&
      (!query.fandomId || product.fandomIds.includes(query.fandomId)) &&
      (!query.collectionId || product.collectionIds.includes(query.collectionId)) &&
      (!query.search || includesSearch(product, query.search)),
  );
}

export const demoCatalogDataSource: CatalogDataSource = {
  async getProductBySlug(slug) {
    return products.find((product) => product.slug === slug) ?? null;
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
