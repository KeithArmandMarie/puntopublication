import "server-only";
import { formatNames, fullName } from "@/lib/content/byline";
import { loadContent } from "@/lib/content/load";
import type { Content } from "@/lib/content/load";
import type { Gallery, Post, StaffMember } from "@/lib/content/schema";
import { tagSlug } from "@/lib/content/slugs";

/**
 * Typed loaders for pages. Server only.
 *
 * Content is read once per build. In `next dev` it is read again on every
 * call, so edits show up on refresh. Drafts are visible in dev and removed
 * from production builds.
 */

export type { Gallery, GalleryImage, Post, StaffMember } from "@/lib/content/schema";
export { fullName } from "@/lib/content/byline";

export type TagCount = {
  /** The tag as first written, for display. */
  tag: string;
  slug: string;
  count: number;
};

export type MonthGroup = {
  /** "2026-11" */
  key: string;
  /** "November 2026" */
  label: string;
  posts: Post[];
};

export type AdjacentPosts = {
  /** The next newer post, if any. */
  newer?: Post;
  /** The next older post, if any. */
  older?: Post;
};

let cached: Content | undefined;

function content(): Content {
  if (process.env.NODE_ENV === "development") return loadContent();
  cached ??= loadContent();
  return cached;
}

function visiblePosts(): Post[] {
  const { posts } = content();
  return process.env.NODE_ENV === "production" ? posts.filter((post) => !post.draft) : posts;
}

// ------------------------------------------------------------------ posts

/** Every post, newest first. */
export function getAllPosts(): Post[] {
  return visiblePosts();
}

export function getPostBySlug(slug: string): Post | undefined {
  return visiblePosts().find((post) => post.slug === slug);
}

export function getPostsBySection(sectionSlug: string): Post[] {
  return visiblePosts().filter((post) => post.section === sectionSlug);
}

export function getPostsByMunicipality(municipalitySlug: string): Post[] {
  return visiblePosts().filter((post) => post.municipality === municipalitySlug);
}

/** Takes the tag slug, for example "school-news". */
export function getPostsByTag(slug: string): Post[] {
  return visiblePosts().filter((post) => post.tags.some((tag) => tagSlug(tag) === slug));
}

/** Every tag with its post count. Most used first, then A to Z. */
export function getAllTags(): TagCount[] {
  const counts = new Map<string, TagCount>();
  for (const post of visiblePosts()) {
    for (const tag of post.tags) {
      const slug = tagSlug(tag);
      const entry = counts.get(slug);
      if (entry) entry.count += 1;
      else counts.set(slug, { tag, slug, count: 1 });
    }
  }
  return [...counts.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function getFeaturedPosts(limit?: number): Post[] {
  const featured = visiblePosts().filter((post) => post.featured);
  return limit === undefined ? featured : featured.slice(0, limit);
}

/** The newest post marked breaking, if any. */
export function getBreakingPost(): Post | undefined {
  return visiblePosts().find((post) => post.breaking);
}

export function getLatestPosts(limit: number): Post[] {
  return visiblePosts().slice(0, limit);
}

/**
 * Posts that go with this one. Same section first, then same municipality,
 * then shared tags. Each group is newest first. The post itself is left out.
 */
export function getRelatedPosts(post: Post, limit: number): Post[] {
  const others = visiblePosts().filter((other) => other.slug !== post.slug);
  const tags = new Set(post.tags.map(tagSlug));
  const sharedTags = (other: Post) => other.tags.filter((tag) => tags.has(tagSlug(tag))).length;

  const groups: Post[][] = [
    others.filter((other) => other.section === post.section),
    others.filter((other) => other.municipality === post.municipality),
    others
      .filter((other) => sharedTags(other) > 0)
      .sort((a, b) => sharedTags(b) - sharedTags(a)),
  ];

  const picked = new Map<string, Post>();
  for (const group of groups) {
    for (const other of group) {
      if (picked.size >= limit) break;
      picked.set(other.slug, other);
    }
  }
  return [...picked.values()];
}

/** The posts just before and after this one in date order. */
export function getAdjacentPosts(post: Post): AdjacentPosts {
  const all = visiblePosts();
  const index = all.findIndex((other) => other.slug === post.slug);
  if (index === -1) return {};
  return { newer: all[index - 1], older: all[index + 1] };
}

const monthFormat = new Intl.DateTimeFormat("en-PH", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** Archive groups, newest month first. The month is the one written in publishedAt. */
export function getPostsGroupedByMonth(): MonthGroup[] {
  const groups = new Map<string, MonthGroup>();
  for (const post of visiblePosts()) {
    const key = post.publishedAt.slice(0, 7);
    let group = groups.get(key);
    if (!group) {
      const [year, month] = key.split("-").map(Number);
      group = { key, label: monthFormat.format(Date.UTC(year, month - 1, 1)), posts: [] };
      groups.set(key, group);
    }
    group.posts.push(post);
  }
  return [...groups.values()];
}

// ------------------------------------------------------------------ staff

export function getAllStaff(): StaffMember[] {
  return content().staff;
}

/** The staff members who wrote the post, in the order listed in the post. */
export function getAuthors(post: Post): StaffMember[] {
  const staff = content().staff;
  return post.authors.map((id) => {
    const member = staff.find((candidate) => candidate.id === id);
    if (!member) {
      throw new Error(`content/posts/${post.slug}.md: unknown author id "${id}".`);
    }
    return member;
  });
}

/** Full names: "Ana Reyes", "Ana Reyes and Ben Cruz". Tagalog posts use "at". */
export function getByline(post: Post): string {
  return formatNames(
    getAuthors(post).map(fullName),
    post.language,
  );
}

// -------------------------------------------------------------- galleries

/** Every gallery, newest first. */
export function getAllGalleries(): Gallery[] {
  return content().galleries;
}

export function getGalleryBySlug(slug: string): Gallery | undefined {
  return content().galleries.find((gallery) => gallery.slug === slug);
}
