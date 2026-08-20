import { convert } from "html-to-text";

export const TARGET_PRODUCT_COUNT = 96;
export const HOMEPAGE_PRIORITY_COUNT = 6;
export const GALLERY_PRODUCT_COUNT = 16;
export const MONEY_UNIT = "TOMAN";

export const universeRules = [
  { id: "universe-one-piece", slug: "one-piece", name: "One Piece", patterns: [/one\s*piece/i] },
  { id: "universe-berserk", slug: "berserk", name: "Berserk", patterns: [/berserk/i] },
  { id: "universe-gta", slug: "gta", name: "Grand Theft Auto", patterns: [/\bgta\b/i, /grand\s+theft\s+auto/i] },
  { id: "universe-the-last-of-us", slug: "the-last-of-us", name: "The Last of Us", patterns: [/the\s+last\s+of\s+us/i] },
  { id: "universe-naruto", slug: "naruto", name: "Naruto", patterns: [/naruto/i] },
  { id: "universe-jujutsu-kaisen", slug: "jujutsu-kaisen", name: "Jujutsu Kaisen", patterns: [/jujutsu(?:\s+kaisen)?/i] },
  { id: "universe-resident-evil", slug: "resident-evil", name: "Resident Evil", patterns: [/resident\s+evil/i] },
  { id: "universe-spider-man", slug: "spider-man", name: "Spider-Man", patterns: [/spider[-\s]*man/i] },
  { id: "universe-batman", slug: "batman", name: "Batman", patterns: [/batman/i] },
  { id: "universe-attack-on-titan", slug: "attack-on-titan", name: "Attack on Titan", patterns: [/attack\s+on\s+titan/i] },
  { id: "universe-demon-slayer", slug: "demon-slayer", name: "Demon Slayer", patterns: [/demon\s+slayer/i] },
  { id: "universe-pokemon", slug: "pokemon", name: "Pokémon", patterns: [/pok[eé]mon/i] },
  { id: "universe-harry-potter", slug: "harry-potter", name: "Harry Potter", patterns: [/harry\s+potter/i] },
  { id: "universe-death-note", slug: "death-note", name: "Death Note", patterns: [/death\s+note/i] },
  { id: "universe-chainsaw-man", slug: "chainsaw-man", name: "Chainsaw Man", patterns: [/chainsaw\s+man/i] },
  { id: "universe-minecraft", slug: "minecraft", name: "Minecraft", patterns: [/minecraft/i] },
  { id: "universe-sonic", slug: "sonic", name: "Sonic", patterns: [/\bsonic\b/i] },
];

export function normalizeText(value) {
  if (!value) {
    return "";
  }

  return convert(String(value), {
    wordwrap: false,
    selectors: [
      { selector: "script", format: "skip" },
      { selector: "style", format: "skip" },
      { selector: "img", format: "skip" },
      { selector: "a", options: { ignoreHref: true } },
    ],
  })
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function decodeSourceSlug(slug) {
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

export function categoryDepth(categoryId, categoryById) {
  let depth = 0;
  let current = categoryById.get(Number(categoryId));
  const visited = new Set();

  while (current?.parent && !visited.has(current.id)) {
    visited.add(current.id);
    depth += 1;
    current = categoryById.get(Number(current.parent));
  }

  return depth;
}

export function primarySourceCategory(product, categoryById) {
  return [...product.categories].sort((left, right) => {
    const depthDifference = categoryDepth(right.id, categoryById) - categoryDepth(left.id, categoryById);
    return depthDifference || Number(left.id) - Number(right.id);
  })[0];
}

export function selectRepresentativeProducts(products, categories) {
  const categoryById = new Map(categories.map((category) => [Number(category.id), category]));
  const candidates = products
    .map((product, sourceOrder) => ({
      ...product,
      sourceOrder,
      primarySourceCategory: primarySourceCategory(product, categoryById),
    }))
    .filter(
      (product) =>
        product.id &&
        normalizeText(product.name) &&
        product.permalink?.startsWith("https://boofchi.ir/product/") &&
        product.primarySourceCategory &&
        product.images?.[0]?.src &&
        /^\d+$/.test(product.prices?.price ?? ""),
    );

  const selected = [];
  const selectedIds = new Set();
  const add = (product) => {
    if (!product || selectedIds.has(product.id) || selected.length >= TARGET_PRODUCT_COUNT) {
      return;
    }
    selected.push(product);
    selectedIds.add(product.id);
  };

  candidates.slice(0, HOMEPAGE_PRIORITY_COUNT).forEach(add);

  const buckets = new Map();
  for (const product of candidates) {
    const categoryId = Number(product.primarySourceCategory.id);
    const bucket = buckets.get(categoryId) ?? [];
    bucket.push(product);
    buckets.set(categoryId, bucket);
  }

  for (const bucket of buckets.values()) {
    bucket.sort(
      (left, right) =>
        Number(right.is_in_stock) - Number(left.is_in_stock) || left.sourceOrder - right.sourceOrder,
    );
  }

  const categoryIds = [...buckets.keys()].sort((left, right) => left - right);
  let round = 0;
  while (selected.length < TARGET_PRODUCT_COUNT) {
    let addedThisRound = 0;
    for (const categoryId of categoryIds) {
      const bucket = buckets.get(categoryId);
      const candidate = bucket?.[round];
      const before = selected.length;
      add(candidate);
      addedThisRound += selected.length - before;
      if (selected.length === TARGET_PRODUCT_COUNT) {
        break;
      }
    }
    if (addedThisRound === 0) {
      break;
    }
    round += 1;
  }

  if (selected.length !== TARGET_PRODUCT_COUNT) {
    throw new Error(`Could select only ${selected.length} valid products.`);
  }

  return selected;
}

export function matchUniverse(title) {
  return universeRules.find((rule) => rule.patterns.some((pattern) => pattern.test(title)));
}

export function normalizeMoney(rawAmount) {
  const amount = Number(rawAmount);
  if (!Number.isSafeInteger(amount)) {
    throw new Error(`Invalid integer money amount: ${rawAmount}`);
  }
  return { amount, unit: MONEY_UNIT };
}
