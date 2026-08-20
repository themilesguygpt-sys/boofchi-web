import type { Category, Product, Universe } from "@boofchi/contracts";

import { demoCatalogDataSource } from "@/data/demo/catalog";

const FEATURED_PRODUCT_IDS = [
  "product-8758",
  "product-5074",
  "product-5235",
  "product-3337",
  "product-8260",
  "product-8459",
] as const;

const HERO_PRODUCT_IDS = ["product-8758", "product-8260", "product-3337"] as const;

const CATEGORY_IDS = [
  "category-256",
  "category-267",
  "category-265",
  "category-263",
  "category-349",
  "category-354",
  "category-291",
  "category-257",
] as const;

const DISCOVERY_PRODUCT_IDS = [
  "product-8295",
  "product-7757",
  "product-8543",
  "product-7230",
  "product-8443",
  "product-8829",
] as const;

function orderedByIds<T extends { id: string }>(items: readonly T[], ids: readonly string[]): T[] {
  const byId = new Map(items.map((item) => [item.id, item]));
  return ids.flatMap((id) => {
    const item = byId.get(id);
    return item ? [item] : [];
  });
}

function descendantCategoryIds(categoryId: string, categories: readonly Category[]): Set<string> {
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

function imageForCategory(
  category: Category,
  categories: readonly Category[],
  products: readonly Product[],
): Product | null {
  const categoryIds = descendantCategoryIds(category.id, categories);
  return (
    products.find(
      (product) =>
        categoryIds.has(product.categoryId) &&
        product.availability === "in-stock" &&
        product.price.amount > 0,
    ) ?? null
  );
}

export interface HomepageUniverse {
  universe: Universe;
  product: Product;
}

export interface HomepageCategory {
  category: Category;
  product: Product;
}

export interface HomepageCatalog {
  heroProducts: readonly Product[];
  featuredProducts: readonly Product[];
  discoveryProducts: readonly Product[];
  universes: readonly HomepageUniverse[];
  categories: readonly HomepageCategory[];
}

export async function getHomepageCatalog(): Promise<HomepageCatalog> {
  const [{ items: products }, categories, universes] = await Promise.all([
    demoCatalogDataSource.listProducts({ limit: 100 }),
    demoCatalogDataSource.listCategories(),
    demoCatalogDataSource.listUniverses(),
  ]);

  const universeCards = universes.flatMap((universe) => {
    const product = products.find(
      (item) => item.universeId === universe.id && item.availability === "in-stock",
    );
    return product ? [{ universe, product }] : [];
  });

  const categoryCards = orderedByIds(categories, CATEGORY_IDS).flatMap((category) => {
    const product = imageForCategory(category, categories, products);
    return product ? [{ category, product }] : [];
  });

  return {
    heroProducts: orderedByIds(products, HERO_PRODUCT_IDS),
    featuredProducts: orderedByIds(products, FEATURED_PRODUCT_IDS),
    discoveryProducts: orderedByIds(products, DISCOVERY_PRODUCT_IDS),
    universes: universeCards,
    categories: categoryCards,
  };
}
