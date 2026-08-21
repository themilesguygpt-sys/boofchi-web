const diacritics = /[\u064B-\u065F\u0670\u06D6-\u06ED]/g;
const punctuation = /[^\p{L}\p{N}\s]+/gu;

export function normalizeSearchText(value: string): string {
  return value
    .normalize("NFKC")
    .replaceAll("ي", "ی")
    .replaceAll("ى", "ی")
    .replaceAll("ك", "ک")
    .replaceAll("ة", "ه")
    .replace(diacritics, "")
    .toLocaleLowerCase("fa")
    .replace(punctuation, " ")
    .replace(/\s+/g, " ")
    .trim();
}
