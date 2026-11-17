import type { Metadata } from "next";
import { logo, siteName } from "@/config/site";
import { fullName, getAuthors } from "@/lib/content";
import type { Post } from "@/lib/content";
import { getSectionBySlug } from "@/lib/content/slugs";
import { absoluteUrl } from "@/lib/site-url";

/**
 * Metadata and structured data for the article page.
 * Authors are shown by full name, in every tag and in the JSON.
 */

export function articlePath(slug: string): string {
  return `/article/${slug}`;
}

/** A date written without a time becomes midnight in Philippine time, so every date has an offset. */
function withManilaTime(iso: string): string {
  return iso.includes("T") ? iso : `${iso}T00:00:00+08:00`;
}

/** JSON for a script tag. "<" is escaped so the text can never close the tag. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export function articleMetadata(post: Post): Metadata {
  const path = articlePath(post.slug);
  const section = getSectionBySlug(post.section);
  const authorNames = getAuthors(post).map((author) => ({ name: fullName(author) }));
  const hasCover = post.coverImage !== undefined;
  const coverAlt = post.coverAlt ?? post.title;

  return {
    title: post.title,
    description: post.excerpt,
    authors: authorNames,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      siteName,
      title: post.title,
      description: post.excerpt,
      locale: post.language === "tl" ? "tl_PH" : "en_PH",
      publishedTime: withManilaTime(post.publishedAt),
      modifiedTime: withManilaTime(post.updatedAt ?? post.publishedAt),
      section: section?.name,
      tags: post.tags,
      images: hasCover
        ? [{ url: post.coverImage as string, alt: coverAlt }]
        : [{ url: logo.src, width: logo.width, height: logo.height, alt: `${siteName} seal` }],
    },
    twitter: {
      card: hasCover ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
      images: hasCover ? [{ url: post.coverImage as string, alt: coverAlt }] : [logo.src],
    },
  };
}

/** NewsArticle structured data. Addresses are left out when the site address is not known. */
export function articleJsonLd(post: Post): string {
  const section = getSectionBySlug(post.section);
  const url = absoluteUrl(articlePath(post.slug));
  const image = absoluteUrl(post.coverImage ?? logo.src);
  const logoUrl = absoluteUrl(logo.src);

  return jsonLdScript({
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: post.excerpt,
    inLanguage: post.language,
    datePublished: withManilaTime(post.publishedAt),
    dateModified: withManilaTime(post.updatedAt ?? post.publishedAt),
    author: getAuthors(post).map((author) => ({ "@type": "Person", name: fullName(author) })),
    publisher: {
      "@type": "Organization",
      name: siteName,
      ...(logoUrl ? { logo: { "@type": "ImageObject", url: logoUrl } } : {}),
    },
    wordCount: post.wordCount,
    ...(section ? { articleSection: section.name } : {}),
    ...(post.tags.length > 0 ? { keywords: post.tags.join(", ") } : {}),
    ...(image ? { image: [image] } : {}),
    ...(url ? { url, mainEntityOfPage: { "@type": "WebPage", "@id": url } } : {}),
  });
}

/** BreadcrumbList: Home, the section, then the story. */
export function breadcrumbJsonLd(post: Post): string {
  const section = getSectionBySlug(post.section);
  const trail = [
    { name: "Home", url: absoluteUrl("/") },
    ...(section ? [{ name: section.name, url: absoluteUrl(section.href) }] : []),
    { name: post.title, url: absoluteUrl(articlePath(post.slug)) },
  ];

  return jsonLdScript({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((step, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: step.name,
      ...(step.url ? { item: step.url } : {}),
    })),
  });
}
