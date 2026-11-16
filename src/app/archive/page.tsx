import type { Metadata } from "next";
import { ArchiveBrowser, type ArchiveItem } from "@/components/ArchiveBrowser";
import { Container } from "@/components/Container";
import { PostCard } from "@/components/PostCard";
import { municipalities, sections } from "@/config/site";
import { getPostsGroupedByMonth } from "@/lib/content";

const description =
  "Every published story, newest first. Choose a section or a municipality to narrow the list.";

export const metadata: Metadata = {
  title: "Archive",
  description,
  alternates: { canonical: "/archive" },
};

/**
 * `/archive`: every published story, grouped by month. The six sections are not pages of
 * their own, they are the filter here (`/archive?section=news`). The filter runs in the
 * browser (see ArchiveBrowser), so the page is static.
 */
export default function ArchivePage() {
  const groups = getPostsGroupedByMonth();

  const items: ArchiveItem[] = groups.flatMap((group) =>
    group.posts.map((post) => ({
      slug: post.slug,
      section: post.section,
      municipality: post.municipality,
      monthKey: group.key,
      monthLabel: group.label,
      card: <PostCard post={post} variant="compact" headingLevel="h3" />,
    })),
  );

  return (
    <Container className="py-section">
      <div className="max-w-4xl">
        <h1>Archive</h1>
        <p className="mt-3 max-w-article text-muted">{description}</p>

        <div className="mt-8">
          {items.length === 0 ? (
            <p className="text-muted">There are no stories yet. Please check back soon.</p>
          ) : (
            <ArchiveBrowser
              items={items}
              sections={sections.map(({ slug, name }) => ({ slug, name }))}
              municipalities={municipalities.map(({ slug, name }) => ({ slug, name }))}
            />
          )}
        </div>
      </div>
    </Container>
  );
}
