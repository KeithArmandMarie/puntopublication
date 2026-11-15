import { z } from "zod";
import {
  municipalitySlugs,
  SLUG_PATTERN,
  sectionSlugs,
  tagSlug,
} from "@/lib/content/slugs";

/**
 * Types and rules for every kind of content.
 * Posts: content/posts/<slug>.md. Staff: content/staff.json.
 * Galleries: content/galleries/<slug>.json.
 * Every object is strict, so a misspelled or extra field is an error.
 */

// ---------------------------------------------------------------- helpers

/** Error text for a field: a clear message when it is missing, the given one when it is wrong. */
function orRequired(wrong: string) {
  return (issue: { input?: unknown }) =>
    issue.input === undefined ? "is required but missing." : wrong;
}

const textError = orRequired("must be text.");

const DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;
const DATE_TIME =
  /^(\d{4})-(\d{2})-(\d{2})T([01]\d|2[0-3]):[0-5]\d(?::[0-5]\d(?:\.\d+)?)?(?:Z|[+-](?:[01]\d|2[0-3]):[0-5]\d)$/;

function isRealCalendarDate(year: number, month: number, day: number): boolean {
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

/** "2026-08-03" or "2026-08-03T09:00:00+08:00". Must be a real date. */
export function isIsoDate(value: string): boolean {
  const match = DATE_ONLY.exec(value) ?? DATE_TIME.exec(value);
  if (!match) return false;
  return isRealCalendarDate(Number(match[1]), Number(match[2]), Number(match[3]));
}

const isoDate = z
  .string({
    error: (issue) =>
      issue.input instanceof Date
        ? 'write the date in quotes, like "2026-08-03". Without quotes the file reader turns it into a date object.'
        : 'must be a date written in quotes, like "2026-08-03" or "2026-08-03T09:00:00+08:00".',
  })
  .refine(isIsoDate, {
    error: 'is not a valid date. Use "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM:SS+08:00", and a real calendar day.',
  });

const slugText = z
  .string({ error: textError })
  .regex(SLUG_PATTERN, {
    error: "must be lowercase letters and numbers joined by single dashes, like \"my-story-title\".",
  });

const requiredText = z
  .string({ error: textError })
  .refine((v) => v.trim().length > 0, { error: "must not be empty." });

/** A file inside /public, written as a path that starts with one slash. */
const LOCAL_PATH = /^\/(?!\/)\S*$/;
const localPath = z
  .string({ error: textError })
  .regex(LOCAL_PATH, {
    error: 'must be a path inside the public folder that starts with one slash, like "/images/photo.webp".',
  });

function oneOf(values: readonly string[], noun: string) {
  return z
    .string({ error: textError })
    .refine((v) => values.includes(v), {
      error: (issue) =>
        `unknown ${noun} "${String(issue.input)}". Use one of: ${values.join(", ")}.`,
    });
}

// ------------------------------------------------------------------ staff

/** Child safety: a first name only. No space, comma or period, so no last name or initial. */
const firstName = z
  .string({ error: textError })
  .refine((v) => v.trim().length > 0, { error: "must not be empty." })
  .refine((v) => !/[\s,.]/.test(v), {
    error: (issue) =>
      `"${String(issue.input)}" must be a single first name. It has a space, comma or period, which could let a last name or initial through. Authors are minors, so use the first name only.`,
  });

export const staffMemberSchema = z
  .object({
    id: slugText,
    firstName,
    position: requiredText,
    municipality: oneOf(municipalitySlugs, "municipality").optional(),
    bio: requiredText.optional(),
    photo: localPath.optional(),
  })
  .strict();

export type StaffMember = z.output<typeof staffMemberSchema>;

// ------------------------------------------------------------------ posts

export const languages = ["en", "tl"] as const;
export type Language = (typeof languages)[number];

export const postFrontmatterSchema = z
  .object({
    title: requiredText,
    slug: slugText,
    excerpt: requiredText,
    publishedAt: isoDate,
    updatedAt: isoDate.optional(),
    section: oneOf(sectionSlugs, "section"),
    municipality: oneOf(municipalitySlugs, "municipality"),
    tags: z.array(requiredText, { error: "must be a list of tags, like [\"school\", \"health\"]." }).default([]),
    authors: z
      .array(slugText, { error: orRequired("must be a list of staff ids, like [\"ana\"].") })
      .min(1, { error: "needs at least one author id from content/staff.json." }),
    language: z.enum(languages, { error: orRequired('must be "en" or "tl".') }),
    coverImage: localPath.optional(),
    coverAlt: requiredText.optional(),
    coverCredit: requiredText.optional(),
    featured: z.boolean({ error: "must be true or false." }).default(false),
    breaking: z.boolean({ error: "must be true or false." }).default(false),
    draft: z.boolean({ error: "must be true or false." }).default(false),
    correction: requiredText.optional(),
  })
  .strict()
  .superRefine((post, ctx) => {
    if (post.coverImage !== undefined && post.coverAlt === undefined) {
      ctx.addIssue({
        code: "custom",
        path: ["coverAlt"],
        message: "is required whenever coverImage is set. Describe the picture for screen readers.",
      });
    }
    const seenTags = new Set<string>();
    post.tags.forEach((tag, index) => {
      const slug = tagSlug(tag);
      if (slug === "") {
        ctx.addIssue({
          code: "custom",
          path: ["tags", index],
          message: `"${tag}" has no letters or numbers.`,
        });
      } else if (seenTags.has(slug)) {
        ctx.addIssue({
          code: "custom",
          path: ["tags", index],
          message: `"${tag}" is listed twice.`,
        });
      }
      seenTags.add(slug);
    });
    const seenAuthors = new Set<string>();
    post.authors.forEach((id, index) => {
      if (seenAuthors.has(id)) {
        ctx.addIssue({
          code: "custom",
          path: ["authors", index],
          message: `"${id}" is listed twice.`,
        });
      }
      seenAuthors.add(id);
    });
  });

export type PostFrontmatter = z.output<typeof postFrontmatterSchema>;

/** A post as the loaders return it. */
export type Post = PostFrontmatter & {
  /** Markdown text, without the frontmatter. */
  body: string;
  wordCount: number;
  /** Whole minutes, at least 1. 200 words per minute for English and Tagalog. */
  readingTime: number;
};

// -------------------------------------------------------------- galleries

export const galleryImageSchema = z
  .object({
    /** Empty or missing means the image renders as a placeholder. */
    src: z
      .string({ error: textError })
      .refine((v) => v === "" || LOCAL_PATH.test(v), {
        error: 'must be empty or a path inside the public folder that starts with one slash, like "/images/photo.webp".',
      })
      .optional()
      .transform((v) => (v === undefined || v === "" ? undefined : v)),
    alt: requiredText,
    caption: requiredText,
    credit: requiredText.optional(),
  })
  .strict();

export const gallerySchema = z
  .object({
    title: requiredText,
    slug: slugText,
    date: isoDate,
    municipality: oneOf(municipalitySlugs, "municipality"),
    description: requiredText,
    images: z
      .array(galleryImageSchema, { error: orRequired("must be a list of images.") })
      .min(1, { error: "needs at least one image." }),
  })
  .strict();

export type GalleryImage = z.output<typeof galleryImageSchema>;
export type Gallery = z.output<typeof gallerySchema>;

/** What PostImage needs from any image: where it is and what it shows. */
export type ImageData = {
  src?: string;
  alt: string;
};
