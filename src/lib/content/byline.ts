import type { Language } from "@/lib/content/schema";

const joiner: Record<Language, string> = { en: "and", tl: "at" };

/**
 * First names joined the natural way.
 * "Ana", "Ana and Ben", "Ana, Ben and Carlo". Tagalog posts use "at" for "and".
 */
export function formatNames(names: readonly string[], language: Language = "en"): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  const word = joiner[language];
  return `${names.slice(0, -1).join(", ")} ${word} ${names[names.length - 1]}`;
}
