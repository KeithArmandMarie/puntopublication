import type { Language } from "@/lib/content/schema";

const joiner: Record<Language, string> = { en: "and", tl: "at" };

/** A person's full name, as shown on the site: "Ana Reyes". */
export function fullName(person: { firstName: string; lastName: string }): string {
  return `${person.firstName.trim()} ${person.lastName.trim()}`.trim();
}

/**
 * Names joined the natural way.
 * "Ana Reyes", "Ana Reyes and Ben Cruz", "Ana Reyes, Ben Cruz and Carlo Diaz".
 * Tagalog posts use "at" for "and".
 */
export function formatNames(names: readonly string[], language: Language = "en"): string {
  if (names.length === 0) return "";
  if (names.length === 1) return names[0];
  const word = joiner[language];
  return `${names.slice(0, -1).join(", ")} ${word} ${names[names.length - 1]}`;
}
