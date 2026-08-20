import type {
  Category,
  ProductAvailability,
  ProductQuery,
  ProductSort,
  Universe,
} from "@boofchi/contracts";

export type CatalogSearchParams = Record<string, string | string[] | undefined>;

export interface CatalogSelection {
  categorySlug?: string;
  universeSlug?: string;
  availability?: ProductAvailability;
  sort: ProductSort;
}

export const sortOptions: readonly { value: ProductSort; label: string }[] = [
  { value: "default", label: "پیش‌فرض" },
  { value: "price-asc", label: "قیمت: کم به زیاد" },
  { value: "price-desc", label: "قیمت: زیاد به کم" },
  { value: "name", label: "نام" },
];

function firstValue(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export function decodeRouteSlug(slug: string): string {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export function parseCatalogSelection(searchParams: CatalogSearchParams): CatalogSelection {
  const availability = firstValue(searchParams.availability);
  const sort = firstValue(searchParams.sort);

  return {
    categorySlug: firstValue(searchParams.category),
    universeSlug: firstValue(searchParams.universe),
    availability:
      availability === "in-stock" || availability === "out-of-stock"
        ? availability
        : undefined,
    sort: sortOptions.some((option) => option.value === sort)
      ? (sort as ProductSort)
      : "default",
  };
}

export function productQueryFromSelection(
  selection: CatalogSelection,
  categories: readonly Category[],
  universes: readonly Universe[],
  locked: Pick<ProductQuery, "categoryId" | "universeId"> = {},
): ProductQuery {
  const category = categories.find((item) => item.slug === selection.categorySlug);
  const universe = universes.find((item) => item.slug === selection.universeSlug);

  return {
    categoryId: locked.categoryId ?? category?.id,
    universeId: locked.universeId ?? universe?.id,
    availability: selection.availability,
    sort: selection.sort,
    limit: 100,
  };
}

export function safeMetadataDescription(value: string | undefined, fallback: string): string {
  const compact = value?.replace(/\s+/g, " ").trim();
  if (!compact) return fallback;
  return compact.length > 155 ? `${compact.slice(0, 152).trimEnd()}…` : compact;
}
