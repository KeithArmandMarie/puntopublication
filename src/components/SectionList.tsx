import { PostCard } from "@/components/PostCard";
import { SectionHeading } from "@/components/SectionHeading";
import { getPostsBySection } from "@/lib/content";
import { getSectionBySlug } from "@/lib/content/slugs";

type SectionListProps = {
  /** Section slug, for example "opinion". */
  slug: string;
  /** Stories already shown higher on the page. They are left out, so nothing repeats. */
  exclude?: ReadonlySet<string>;
  /** How many stories to show. Defaults to 3. */
  limit?: number;
};

/**
 * A section on the home page: its heading and its newest stories as compact cards,
 * skipping stories already shown above. Renders nothing when none are left.
 */
export function SectionList({ slug, exclude, limit = 3 }: SectionListProps) {
  const section = getSectionBySlug(slug);
  if (!section) return null;

  const posts = getPostsBySection(slug)
    .filter((post) => !exclude?.has(post.slug))
    .slice(0, limit);
  if (posts.length === 0) return null;

  const headingId = `section-list-${slug}`;

  return (
    <section aria-labelledby={headingId}>
      <SectionHeading
        title={section.name}
        href={section.href}
        linkLabel={`See all ${section.name} stories`}
        id={headingId}
      />
      <ul className="mt-4 divide-y divide-border">
        {posts.map((post) => (
          <li key={post.slug} className="py-4 first:pt-0 last:pb-0">
            <PostCard post={post} variant="compact" />
          </li>
        ))}
      </ul>
    </section>
  );
}
