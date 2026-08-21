import type {
  CatalogSearchService,
  Category,
  Product,
  Universe,
} from "@boofchi/contracts";

import { normalizeSearchText } from "@/lib/search-normalize";

import { demoCatalogDataSource } from "./catalog";

const aliasGroups = [
  ["naruto", "naroto", "ناروتو"],
  ["one piece", "onepiece", "وان پیس", "وانپیس"],
  ["harry potter", "harrypotter", "هری پاتر", "هریپاتر"],
  ["the last of us", "last of us", "thelastofus", "لست اف اس", "آخرین بازمانده از ما"],
  ["jujutsu kaisen", "jujutsu", "جوجوتسو کایسن", "جوجوتسو"],
  ["spider man", "spiderman", "اسپایدرمن", "مرد عنکبوتی"],
  ["grand theft auto", "gta", "جی تی ای"],
  ["berserk", "برزرک"],
  ["batman", "بتمن"],
] as const;

interface SearchDocument {
  product: Product;
  title: string;
  alternateTitle: string;
  slug: string;
  category: string;
  universe: string;
  order: number;
}

function editDistanceWithin(left: string, right: string, maximum: number): boolean {
  if (Math.abs(left.length - right.length) > maximum) return false;
  const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    const current = [leftIndex];
    let rowMinimum = current[0] ?? leftIndex;
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const substitution = (previous[rightIndex - 1] ?? maximum + 1) +
        (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1);
      const value = Math.min(
        (previous[rightIndex] ?? maximum + 1) + 1,
        (current[rightIndex - 1] ?? maximum + 1) + 1,
        substitution,
      );
      current.push(value);
      rowMinimum = Math.min(rowMinimum, value);
    }
    if (rowMinimum > maximum) return false;
    previous.splice(0, previous.length, ...current);
  }

  return (previous[right.length] ?? maximum + 1) <= maximum;
}

function queryForms(query: string): string[] {
  const normalized = normalizeSearchText(query);
  if (!normalized) return [];
  const matchingGroup = aliasGroups.find((group) =>
    group.some((alias) => normalizeSearchText(alias) === normalized),
  );
  return [...new Set([normalized, ...(matchingGroup ?? []).map(normalizeSearchText)])];
}

function scoreField(field: string, query: string, weights: readonly number[]): number {
  if (!field) return 0;
  const [exact = 0, prefix = 0, contains = 0] = weights;
  if (field === query) return exact;
  if (field.startsWith(query)) return prefix;
  if (field.includes(query)) return contains;
  return 0;
}

function fuzzyScore(document: SearchDocument, query: string): number {
  const queryTokens = query.split(" ").filter(Boolean);
  const documentTokens = [
    document.title,
    document.alternateTitle,
    document.slug,
    document.category,
    document.universe,
  ].flatMap((field) => field.split(" ").filter(Boolean));

  if (!queryTokens.length) return 0;
  const matches = queryTokens.every((queryToken) => {
    const maximum = queryToken.length >= 8 ? 2 : queryToken.length >= 4 ? 1 : 0;
    return documentTokens.some(
      (documentToken) =>
        documentToken.startsWith(queryToken) ||
        (maximum > 0 && editDistanceWithin(queryToken, documentToken, maximum)),
    );
  });
  return matches ? 260 : 0;
}

function scoreDocument(document: SearchDocument, forms: readonly string[]): number {
  return Math.max(
    0,
    ...forms.map((form) =>
      Math.max(
        scoreField(document.title, form, [1200, 980, 820]),
        scoreField(document.alternateTitle, form, [1160, 940, 790]),
        scoreField(document.slug, form, [900, 760, 620]),
        scoreField(document.universe, form, [860, 720, 650]),
        scoreField(document.category, form, [680, 570, 500]),
        fuzzyScore(document, form),
      ),
    ),
  );
}

async function buildDocuments(): Promise<SearchDocument[]> {
  const [{ items: products }, categories, universes] = await Promise.all([
    demoCatalogDataSource.listProducts({ limit: 100 }),
    demoCatalogDataSource.listCategories(),
    demoCatalogDataSource.listUniverses(),
  ]);
  const categoriesById = new Map<string, Category>(
    categories.map((category) => [category.id, category]),
  );
  const universesById = new Map<string, Universe>(
    universes.map((universe) => [universe.id, universe]),
  );

  return products.map((product, order) => {
    const category = categoriesById.get(product.categoryId);
    const universe = product.universeId ? universesById.get(product.universeId) : undefined;
    return {
      product,
      title: normalizeSearchText(product.title.fa),
      alternateTitle: normalizeSearchText(product.title.en ?? ""),
      slug: normalizeSearchText(product.slug.replaceAll("-", " ")),
      category: normalizeSearchText(
        [category?.name.fa, category?.name.en].filter(Boolean).join(" "),
      ),
      universe: normalizeSearchText(
        [universe?.name.fa, universe?.name.en].filter(Boolean).join(" "),
      ),
      order,
    };
  });
}

export const demoCatalogSearchService: CatalogSearchService = {
  async search(query, limit = 24) {
    const forms = queryForms(query);
    if (!forms.length) return { query: query.trim(), items: [], total: 0 };

    const documents = await buildDocuments();
    const ranked = documents
      .map((document) => ({ document, score: scoreDocument(document, forms) }))
      .filter((entry) => entry.score > 0)
      .sort(
        (left, right) =>
          right.score - left.score || left.document.order - right.document.order,
      );
    const safeLimit = Math.min(Math.max(limit, 1), 100);

    return {
      query: query.trim(),
      items: ranked.slice(0, safeLimit).map((entry) => entry.document.product),
      total: ranked.length,
    };
  },
};
