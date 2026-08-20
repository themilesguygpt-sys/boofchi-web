export type EntityId = string;

export interface LocalizedText {
  fa: string;
  en?: string;
}

export interface Category {
  id: EntityId;
  slug: string;
  name: LocalizedText;
  parentId?: EntityId;
}

export type MoneyUnit = "TOMAN";

export type ProductAvailability = "in-stock" | "out-of-stock" | "unknown";

export type ProductSort = "default" | "price-asc" | "price-desc" | "name";

export interface Universe {
  id: EntityId;
  slug: string;
  name: LocalizedText;
}

export interface Fandom {
  id: EntityId;
  slug: string;
  name: LocalizedText;
  universeId?: EntityId;
}

export interface Character {
  id: EntityId;
  slug: string;
  name: LocalizedText;
  universeId: EntityId;
}

export interface Collection {
  id: EntityId;
  slug: string;
  name: LocalizedText;
  description?: LocalizedText;
}

export interface Money {
  /**
   * Canonical stored amount. This must always be an integer; floating-point
   * monetary values are forbidden.
   */
  amount: number;
  unit: MoneyUnit;
}

export interface ProductImage {
  id: EntityId;
  path: string;
  alt: string;
  width: number;
  height: number;
  primary: boolean;
}

export interface Product {
  id: EntityId;
  slug: string;
  title: LocalizedText;
  shortDescription?: string;
  description?: string;
  categoryId: EntityId;
  universeId?: EntityId;
  fandomIds: readonly EntityId[];
  characterIds: readonly EntityId[];
  collectionIds: readonly EntityId[];
  price: Money;
  regularPrice?: Money;
  salePrice?: Money;
  availability: ProductAvailability;
  images: readonly ProductImage[];
  sku?: string;
  sourceUrl: string;
}

export interface ProductQuery {
  categoryId?: EntityId;
  universeId?: EntityId;
  availability?: ProductAvailability;
  fandomId?: EntityId;
  collectionId?: EntityId;
  search?: string;
  sort?: ProductSort;
  cursor?: string;
  limit?: number;
}

export interface PageResult<T> {
  items: readonly T[];
  nextCursor?: string;
}

export interface CategoryFilterOption {
  category: Category;
  count: number;
}

export interface UniverseFilterOption {
  universe: Universe;
  count: number;
}

export interface AvailabilityFilterOption {
  availability: ProductAvailability;
  count: number;
}

export interface AvailableProductFilters {
  categories: readonly CategoryFilterOption[];
  universes: readonly UniverseFilterOption[];
  availability: readonly AvailabilityFilterOption[];
}

/**
 * Minimal boundary for demo data today and a Medusa REST adapter later.
 * UI code consumes this contract rather than a particular JSON payload.
 */
export interface CatalogDataSource {
  getProductBySlug(slug: string): Promise<Product | null>;
  getCategoryBySlug(slug: string): Promise<Category | null>;
  getUniverseBySlug(slug: string): Promise<Universe | null>;
  getRelatedProducts(productSlug: string, limit?: number): Promise<readonly Product[]>;
  getAvailableFilters(query?: ProductQuery): Promise<AvailableProductFilters>;
  listProducts(query?: ProductQuery): Promise<PageResult<Product>>;
  listCategories(): Promise<readonly Category[]>;
  listUniverses(): Promise<readonly Universe[]>;
  listFandoms(): Promise<readonly Fandom[]>;
  listCharacters(): Promise<readonly Character[]>;
  listCollections(): Promise<readonly Collection[]>;
}
