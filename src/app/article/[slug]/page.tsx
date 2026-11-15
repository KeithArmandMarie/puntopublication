import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleNav } from "@/components/ArticleNav";
import { AuthorBlock } from "@/components/AuthorBlock";
import { Chip } from "@/components/Chip";
import { Container } from "@/components/Container";
import { CorrectionNote } from "@/components/CorrectionNote";
import { Markdown } from "@/components/Markdown";
import { PostCard } from "@/components/PostCard";
import { LanguageBadge } from "@/components/PostLabels";
import { PostDate } from "@/components/PostDate";
import { PostImage } from "@/components/PostImage";
import { SectionHeading } from "@/components/SectionHeading";
import { ShareRow } from "@/components/ShareRow";
import {
  articleJsonLd,
  articleMetadata,
  articlePath,
  breadcrumbJsonLd,
} from "@/lib/article-seo";
import {
  getAdjacentPosts,
  getAllPosts,
  getAuthors,
  getByline,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/content";
import { getMunicipalityBySlug, getSectionBySlug, tagHref } from "@/lib/content/slugs";
import { formatReadingTime } from "@/lib/format";

/**
 * Every published post is built at build time. Any other address is a 404.
 * Drafts are left out of production builds by the loaders and show in dev.
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/article/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  return post ? articleMetadata(post) : {};
}

/** The cover is as wide as the header block (896px) from 944px, and full width below that. */
const coverSizes = "(min-width: 944px) 896px, 100vw";
const relatedSizes = "(min-width: 944px) 283px, (min-width: 768px) 33vw, 100vw";

export default async function ArticlePage(props: PageProps<"/article/[slug]">) {
  const { slug } = await props.params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const section = getSectionBySlug(post.section);
  const municipality = getMunicipalityBySlug(post.municipality);
  const authors = getAuthors(post);
  const related = getRelatedPosts(post, 3);
  const adjacent = getAdjacentPosts(post);
  const path = articlePath(post.slug);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: articleJsonLd(post) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: breadcrumbJsonLd(post) }} />

      <Container className="py-8 md:py-section">
        <article>
          <header className="mx-auto max-w-4xl border-b border-border pb-6">
            <p className="flex flex-wrap items-center gap-x-4 text-sm">
              {section ? (
                <Link
                  href={section.href}
                  className="link inline-flex min-h-11 items-center font-bold"
                >
                  {section.name}
                </Link>
              ) : null}
              {municipality ? (
                <Link href={municipality.href} className="link inline-flex min-h-11 items-center">
                  {municipality.name}
                </Link>
              ) : null}
              <LanguageBadge language={post.language} />
            </p>

            <h1 lang={post.language} className="mt-1">
              {post.title}
            </h1>
            <p lang={post.language} className="mt-4 text-lg">
              {post.excerpt}
            </p>

            <p className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted">
              <span className="font-semibold text-foreground">By {getByline(post)}</span>
              <span>
                Published <PostDate iso={post.publishedAt} />
              </span>
              {post.updatedAt ? (
                <span>
                  Updated <PostDate iso={post.updatedAt} />
                </span>
              ) : null}
              <span>{formatReadingTime(post.readingTime)}</span>
            </p>
          </header>

          {post.correction ? (
            <CorrectionNote language={post.language} className="mx-auto mt-6 max-w-4xl">
              {post.correction}
            </CorrectionNote>
          ) : null}

          <figure className="mx-auto mt-6 max-w-4xl">
            <PostImage post={post} ratio="16/9" sizes={coverSizes} priority />
            {post.coverImage ? (
              <figcaption className="mt-2 flex flex-wrap gap-x-3 text-sm text-muted">
                <span lang={post.language}>{post.coverAlt}</span>
                {post.coverCredit ? <span>Photo: {post.coverCredit}</span> : null}
              </figcaption>
            ) : null}
          </figure>

          <div
            lang={post.language}
            className="text-article mx-auto mt-8 max-w-article wrap-anywhere"
          >
            <Markdown>{post.body}</Markdown>
          </div>

          <div className="mx-auto mt-10 max-w-article space-y-6">
            <ShareRow title={post.title} path={path} className="border-t border-border pt-6" />

            {post.tags.length > 0 ? (
              <section aria-labelledby="tags-heading" className="border-t border-border pt-6">
                <p id="tags-heading" className="text-sm font-bold">
                  Tags
                </p>
                <ul className="mt-3 flex flex-wrap gap-3">
                  {post.tags.map((tag) => (
                    <li key={tag}>
                      <Chip href={tagHref(tag)}>{tag}</Chip>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <AuthorBlock authors={authors} className="border-t border-border pt-6" />
          </div>
        </article>

        {related.length > 0 ? (
          <section aria-labelledby="related-heading" className="mx-auto mt-section max-w-4xl">
            <SectionHeading title="Related stories" id="related-heading" />
            <div className="mt-6 grid gap-x-6 gap-y-8 md:grid-cols-3">
              {related.map((story) => (
                <PostCard key={story.slug} post={story} variant="standard" sizes={relatedSizes} />
              ))}
            </div>
          </section>
        ) : null}

        <ArticleNav {...adjacent} className="mx-auto mt-section max-w-4xl" />
      </Container>
    </>
  );
}
