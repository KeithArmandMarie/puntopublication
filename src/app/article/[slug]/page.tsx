import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AuthorBlock } from "@/components/AuthorBlock";
import { Chip } from "@/components/Chip";
import { Container } from "@/components/Container";
import { Markdown } from "@/components/Markdown";
import { PostCard } from "@/components/PostCard";
import { PostDate } from "@/components/PostDate";
import { PostImage } from "@/components/PostImage";
import { PostLabels } from "@/components/PostLabels";
import { SectionHeading } from "@/components/SectionHeading";
import { ShareRow } from "@/components/ShareRow";
import { logo, siteName } from "@/config/site";
import {
  getAdjacentPosts,
  getAllPosts,
  getAuthors,
  getByline,
  getPostBySlug,
  getRelatedPosts,
} from "@/lib/content";
import { getSectionBySlug, tagHref } from "@/lib/content/slugs";
import { formatReadingTime } from "@/lib/format";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<"/article/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const path = `/article/${post.slug}`;
  // First names only, for every author.
  const authorNames = getAuthors(post).map((author) => author.firstName);
  const image = post.coverImage
    ? { url: post.coverImage, alt: post.coverAlt ?? post.title }
    : { url: logo.src, width: logo.width, height: logo.height, alt: `${siteName} seal` };

  return {
    title: post.title,
    description: post.excerpt,
    authors: authorNames.map((name) => ({ name })),
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      siteName,
      title: post.title,
      description: post.excerpt,
      locale: post.language === "tl" ? "tl_PH" : "en_PH",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      section: getSectionBySlug(post.section)?.name,
      tags: post.tags,
      images: [image],
    },
    twitter: {
      card: post.coverImage ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
      images: [image.url],
    },
  };
}

export default async function ArticlePage({ params }: PageProps<"/article/[slug]">) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const authors = getAuthors(post);
  const related = getRelatedPosts(post, 3);
  const { newer, older } = getAdjacentPosts(post);

  return (
    <Container className="py-8 md:py-section">
      <article className="mx-auto max-w-4xl">
        <header>
          <PostLabels post={post} linked />
          <h1 lang={post.language} className="mt-1">
            {post.title}
          </h1>
          <p lang={post.language} className="mt-4 text-lg text-muted">
            {post.excerpt}
          </p>
          <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted [&>*+*]:border-l [&>*+*]:border-border [&>*+*]:pl-3">
            <span>
              By <span className="font-semibold text-foreground">{getByline(post)}</span>
            </span>
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
          <aside
            aria-labelledby="correction-label"
            className="mt-6 border border-brand-border bg-surface p-4"
          >
            <p id="correction-label" className="font-bold">
              Correction
            </p>
            <p className="mt-1">{post.correction}</p>
          </aside>
        ) : null}

        <figure className="mt-6">
          <PostImage
            post={post}
            ratio="16/9"
            priority
            sizes="(min-width: 1024px) 896px, 100vw"
          />
          {post.coverCredit ? (
            <figcaption className="mt-2 text-sm text-muted">Photo: {post.coverCredit}</figcaption>
          ) : null}
        </figure>

        <div lang={post.language} className="mt-8">
          <Markdown className="text-prose">{post.body}</Markdown>
        </div>

        <div className="mt-12 space-y-8 border-t border-border pt-8">
          <ShareRow path={`/article/${post.slug}`} title={post.title} />

          {post.tags.length > 0 ? (
            <section aria-labelledby="tags-heading">
              <h2 id="tags-heading" className="mb-3 text-lg font-bold">
                Tags
              </h2>
              <ul className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <li key={tag}>
                    <Chip href={tagHref(tag)}>{tag}</Chip>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <AuthorBlock authors={authors} />
        </div>

        {newer || older ? (
          <nav aria-label="More stories" className="mt-12 grid gap-4 border-y border-border py-6 sm:grid-cols-2">
            {older ? (
              <Link href={`/article/${older.slug}`} rel="prev" className="group block">
                <span className="text-sm text-muted">Older story</span>
                <span lang={older.language} className="mt-1 block font-bold tracking-tight group-hover:underline">
                  {older.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {newer ? (
              <Link href={`/article/${newer.slug}`} rel="next" className="group block sm:text-right">
                <span className="text-sm text-muted">Newer story</span>
                <span lang={newer.language} className="mt-1 block font-bold tracking-tight group-hover:underline">
                  {newer.title}
                </span>
              </Link>
            ) : null}
          </nav>
        ) : null}
      </article>

      {related.length > 0 ? (
        <section aria-labelledby="related-heading" className="mt-section">
          <SectionHeading title="Related stories" id="related-heading" />
          <div className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <PostCard key={item.slug} post={item} variant="standard" />
            ))}
          </div>
        </section>
      ) : null}
    </Container>
  );
}
