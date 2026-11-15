import type { Metadata } from "next";
import Link from "next/link";
import { buttonClasses } from "@/components/Button";
import { Container } from "@/components/Container";
import { Pagination } from "@/components/Pagination";
import { PostCard } from "@/components/PostCard";
import { getPostsBySection } from "@/lib/content";
import type { Section } from "@/config/site";

export const POSTS_PER_PAGE = 12;

export function sectionPageHref(section: Pick<Section, "href">, page: number): string {
  return page <= 1 ? section.href : `${section.href}/page/${page}`;
}

export function totalPagesFor(postCount: number): number {
  return Math.max(1, Math.ceil(postCount / POSTS_PER_PAGE));
}

/** Title, description, canonical and previous and next hints for one page of a section. */
export function sectionMetadata(section: Section, page: number): Metadata {
  const totalPages = totalPagesFor(getPostsBySection(section.slug).length);
  const description = `Stories in ${section.name}, newest first.`;
  return {
    title: page > 1 ? `${section.name}, page ${page}` : section.name,
    description,
    alternates: { canonical: sectionPageHref(section, page) },
    pagination: {
      previous: page > 1 ? sectionPageHref(section, page - 1) : null,
      next: page < totalPages ? sectionPageHref(section, page + 1) : null,
    },
    openGraph: {
      type: "website",
      url: sectionPageHref(section, page),
      title: page > 1 ? `${section.name}, page ${page}` : section.name,
      description,
    },
  };
}

type SectionListingProps = {
  section: Section;
  page: number;
};

/**
 * One page of a section: the heading with the post count, then the posts.
 * Page 1 opens with the newest story as a large card. Later pages are a plain grid.
 */
export function SectionListing({ section, page }: SectionListingProps) {
  const posts = getPostsBySection(section.slug);
  const totalPages = totalPagesFor(posts.length);
  const pagePosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
  const lead = page === 1 ? pagePosts[0] : undefined;
  const rest = page === 1 ? pagePosts.slice(1) : pagePosts;
  const count = posts.length === 1 ? "1 story" : `${posts.length} stories`;

  return (
    <Container className="py-8 md:py-section">
      <header className="border-b border-brand-border pb-4">
        <h1>{section.name}</h1>
        <p className="mt-2 text-muted">
          {count}
          {totalPages > 1 ? `, page ${page} of ${totalPages}` : ""}
        </p>
      </header>

      {posts.length === 0 ? (
        <div className="mt-8 max-w-prose">
          <p>There are no stories in {section.name} yet.</p>
          <Link href="/" className={`${buttonClasses("secondary")} mt-4`}>
            Back to the home page
          </Link>
        </div>
      ) : (
        <>
          {lead ? (
            <div className="mt-8">
              <PostCard
                post={lead}
                variant="large"
                headingLevel="h2"
                hero
                priority
                sizes="(min-width: 1024px) 1200px, 100vw"
              />
            </div>
          ) : null}

          {rest.length > 0 ? (
            <div className="mt-8 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <PostCard key={post.slug} post={post} variant="standard" headingLevel="h2" />
              ))}
            </div>
          ) : null}

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            hrefForPage={(n) => sectionPageHref(section, n)}
            label={`${section.name} pages`}
          />
        </>
      )}
    </Container>
  );
}
