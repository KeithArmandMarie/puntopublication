import { municipalities, sections } from "@/config/site";
import type { Municipality, Section } from "@/config/site";
import { slugify } from "@/lib/slug";

/**
 * One place for every slug. Sections and municipalities come from
 * src/config/site.ts. Tags are free text, so their slug is made here.
 * This file has no server only code, so client components can import it.
 */

export { slugify };

/** Lowercase letters and numbers, words joined by single dashes. */
export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const sectionSlugs: readonly string[] = sections.map((s) => s.slug);
export const municipalitySlugs: readonly string[] = municipalities.map((m) => m.slug);

export function isSectionSlug(slug: string): boolean {
  return sectionSlugs.includes(slug);
}

export function isMunicipalitySlug(slug: string): boolean {
  return municipalitySlugs.includes(slug);
}

export function getSectionBySlug(slug: string): Section | undefined {
  return sections.find((s) => s.slug === slug);
}

export function getMunicipalityBySlug(slug: string): Municipality | undefined {
  return municipalities.find((m) => m.slug === slug);
}

/** "Santa Cruz" and "santa cruz" both give "santa-cruz". */
export function tagSlug(tag: string): string {
  return slugify(tag);
}

export function tagHref(tag: string): string {
  return `/tag/${tagSlug(tag)}`;
}
