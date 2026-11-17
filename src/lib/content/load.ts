import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { ContentError, formatZodError } from "@/lib/content/errors";
import { countWords, findBodyProblems, readingMinutes } from "@/lib/content/markdown";
import {
  gallerySchema,
  postFrontmatterSchema,
  staffMemberSchema,
} from "@/lib/content/schema";
import type { Gallery, Post, StaffMember } from "@/lib/content/schema";
import { tagSlug } from "@/lib/content/slugs";

/**
 * Reads and checks every content file. Nothing here is cached and drafts are
 * kept, so the check script sees everything. index.ts adds caching and hides
 * drafts in production.
 */

export type Content = {
  /** Newest first, drafts included. */
  posts: Post[];
  staff: StaffMember[];
  /** Newest first. */
  galleries: Gallery[];
};

const CONTENT_DIR = "content";
const POSTS_DIR = `${CONTENT_DIR}/posts`;
const GALLERIES_DIR = `${CONTENT_DIR}/galleries`;
const STAFF_FILE = `${CONTENT_DIR}/staff.json`;

// Scoped to the content folder, so the build does not trace the whole project.
const CONTENT_ROOT = path.join(/*turbopackIgnore: true*/ process.cwd(), CONTENT_DIR);

function absolute(relativePath: string): string {
  return path.join(CONTENT_ROOT, path.relative(CONTENT_DIR, relativePath));
}

/** Files in a folder with the given extension. Anything else in there is a mistake. */
function listFiles(dir: string, extension: string, problems: string[]): string[] {
  if (!fs.existsSync(absolute(dir))) {
    problems.push(`${dir}: this folder is missing. Create it, even if it is empty.`);
    return [];
  }
  const names = fs.readdirSync(absolute(dir)).filter((name) => !name.startsWith("."));
  const wrong = names.filter((name) => !name.endsWith(extension));
  for (const name of wrong) {
    problems.push(`${dir}/${name}: only ${extension} files belong in this folder.`);
  }
  return names.filter((name) => name.endsWith(extension)).sort();
}

function byNewest(a: { date: string; slug: string }, b: { date: string; slug: string }): number {
  return Date.parse(b.date) - Date.parse(a.date) || a.slug.localeCompare(b.slug);
}

type StaffLoad = {
  staff: StaffMember[];
  /** Every id written in the file, even for entries with other problems. Keeps one mistake from causing many. */
  writtenIds: Set<string>;
};

function loadStaff(problems: string[]): StaffLoad {
  const staff: StaffMember[] = [];
  const writtenIds = new Set<string>();
  if (!fs.existsSync(absolute(STAFF_FILE))) {
    problems.push(`${STAFF_FILE}: this file is missing. Create it with [] if there is no staff yet.`);
    return { staff, writtenIds };
  }
  let data: unknown;
  try {
    data = JSON.parse(fs.readFileSync(absolute(STAFF_FILE), "utf8"));
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    problems.push(`${STAFF_FILE}: this is not valid JSON (${reason}).`);
    return { staff, writtenIds };
  }
  if (!Array.isArray(data)) {
    problems.push(`${STAFF_FILE}: must be a list, written as [ { ... }, { ... } ].`);
    return { staff, writtenIds };
  }

  const seen = new Set<string>();
  data.forEach((entry: unknown, index) => {
    const id =
      typeof entry === "object" && entry !== null && "id" in entry && typeof entry.id === "string"
        ? entry.id
        : undefined;
    if (id !== undefined) writtenIds.add(id);
    const label = `${STAFF_FILE}, entry ${index + 1}${id === undefined ? "" : ` ("${id}")`}`;
    const result = staffMemberSchema.safeParse(entry);
    if (!result.success) {
      const lines = formatZodError(label, result.error);
      const hasUnknownKey = result.error.issues.some((issue) => issue.code === "unrecognized_keys");
      problems.push(
        hasUnknownKey
          ? `${lines}\n  Allowed fields: id, firstName, lastName, position, municipality, bio, photo.`
          : lines,
      );
      return;
    }
    if (seen.has(result.data.id)) {
      problems.push(`${label}, field "id": "${result.data.id}" is used twice. Every staff id must be unique.`);
      return;
    }
    seen.add(result.data.id);
    staff.push(result.data);
  });
  return { staff, writtenIds };
}

function loadPosts(staffIds: Set<string>, problems: string[]): Post[] {
  const posts: Post[] = [];
  const seenSlugs = new Set<string>();
  const tagLabels = new Map<string, { label: string; file: string }>();

  for (const name of listFiles(POSTS_DIR, ".md", problems)) {
    const file = `${POSTS_DIR}/${name}`;
    const fileSlug = name.slice(0, -".md".length);
    const found: string[] = [];

    let parsed: matter.GrayMatterFile<string>;
    try {
      parsed = matter(fs.readFileSync(absolute(file), "utf8"));
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      problems.push(
        `${file}: the frontmatter could not be read (${reason}). Check the two --- lines and the indentation.`,
      );
      continue;
    }

    const result = postFrontmatterSchema.safeParse(parsed.data);
    if (!result.success) found.push(formatZodError(file, result.error));

    const slugValue = (parsed.data as { slug?: unknown }).slug;
    if (typeof slugValue === "string" && slugValue !== fileSlug) {
      found.push(
        `${file}, field "slug": must match the file name. The file is "${fileSlug}.md" but slug is "${slugValue}".`,
      );
    }

    const body = parsed.content.trim();
    if (body === "") {
      found.push(`${file}, body: the post has no text below the frontmatter.`);
    }
    for (const problem of findBodyProblems(body)) {
      found.push(`${file}, body: ${problem}`);
    }

    if (result.success) {
      const frontmatter = result.data;
      frontmatter.authors.forEach((id, index) => {
        if (!staffIds.has(id)) {
          found.push(
            `${file}, field "authors[${index}]": unknown staff id "${id}". Add it to ${STAFF_FILE} first. Known ids: ${[...staffIds].join(", ") || "(none)"}.`,
          );
        }
      });
      if (seenSlugs.has(frontmatter.slug)) {
        found.push(`${file}, field "slug": "${frontmatter.slug}" is used by another post. Slugs must be unique.`);
      }
      seenSlugs.add(frontmatter.slug);

      for (const tag of frontmatter.tags) {
        const slug = tagSlug(tag);
        const earlier = tagLabels.get(slug);
        if (earlier && earlier.label !== tag) {
          found.push(
            `${file}, field "tags": "${tag}" and "${earlier.label}" (in ${earlier.file}) both become the tag address "${slug}". Spell the tag the same way in both.`,
          );
        } else if (!earlier) {
          tagLabels.set(slug, { label: tag, file });
        }
      }

      if (found.length === 0) {
        const wordCount = countWords(body);
        posts.push({
          ...frontmatter,
          body,
          wordCount,
          readingTime: readingMinutes(wordCount),
        });
      }
    }

    problems.push(...found);
  }

  return posts.sort((a, b) =>
    byNewest({ date: a.publishedAt, slug: a.slug }, { date: b.publishedAt, slug: b.slug }),
  );
}

function loadGalleries(problems: string[]): Gallery[] {
  const galleries: Gallery[] = [];
  const seenSlugs = new Set<string>();

  for (const name of listFiles(GALLERIES_DIR, ".json", problems)) {
    const file = `${GALLERIES_DIR}/${name}`;
    const fileSlug = name.slice(0, -".json".length);

    let data: unknown;
    try {
      data = JSON.parse(fs.readFileSync(absolute(file), "utf8"));
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      problems.push(`${file}: this is not valid JSON (${reason}).`);
      continue;
    }

    const result = gallerySchema.safeParse(data);
    const found: string[] = [];
    if (!result.success) found.push(formatZodError(file, result.error));

    const slugValue = (data as { slug?: unknown } | null)?.slug;
    if (typeof slugValue === "string" && slugValue !== fileSlug) {
      found.push(
        `${file}, field "slug": must match the file name. The file is "${fileSlug}.json" but slug is "${slugValue}".`,
      );
    }
    if (result.success) {
      if (seenSlugs.has(result.data.slug)) {
        found.push(`${file}, field "slug": "${result.data.slug}" is used by another gallery. Slugs must be unique.`);
      }
      seenSlugs.add(result.data.slug);
      if (found.length === 0) galleries.push(result.data);
    }
    problems.push(...found);
  }

  return galleries.sort((a, b) =>
    byNewest({ date: a.date, slug: a.slug }, { date: b.date, slug: b.slug }),
  );
}

/** Loads and checks everything. Throws one ContentError listing every problem. */
export function loadContent(): Content {
  const problems: string[] = [];
  const { staff, writtenIds } = loadStaff(problems);
  const posts = loadPosts(writtenIds, problems);
  const galleries = loadGalleries(problems);

  if (problems.length > 0) {
    const count = problems.length === 1 ? "1 problem" : `${problems.length} problems`;
    throw new ContentError(`Content check failed with ${count}:\n\n${problems.join("\n")}\n`);
  }
  return { posts, staff, galleries };
}
