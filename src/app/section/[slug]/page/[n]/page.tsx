import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sections } from "@/config/site";
import { getPostsBySection } from "@/lib/content";
import { getSectionBySlug } from "@/lib/content/slugs";
import { SectionListing, sectionMetadata, totalPagesFor } from "../../SectionListing";

export const dynamicParams = false;

/** Pages 2 and up. Page 1 lives at /section/[slug]. */
export function generateStaticParams() {
  return sections.flatMap((section) => {
    const totalPages = totalPagesFor(getPostsBySection(section.slug).length);
    return Array.from({ length: totalPages - 1 }, (_, index) => ({
      slug: section.slug,
      n: String(index + 2),
    }));
  });
}

/** The page number, or undefined when the address is not a real page of that section. */
function pageNumber(slug: string, n: string): number | undefined {
  if (!/^[1-9]\d*$/.test(n)) return undefined;
  const page = Number(n);
  const totalPages = totalPagesFor(getPostsBySection(slug).length);
  return page >= 2 && page <= totalPages ? page : undefined;
}

export async function generateMetadata({
  params,
}: PageProps<"/section/[slug]/page/[n]">): Promise<Metadata> {
  const { slug, n } = await params;
  const section = getSectionBySlug(slug);
  const page = pageNumber(slug, n);
  return section && page ? sectionMetadata(section, page) : {};
}

export default async function SectionPagedPage({ params }: PageProps<"/section/[slug]/page/[n]">) {
  const { slug, n } = await params;
  const section = getSectionBySlug(slug);
  const page = pageNumber(slug, n);
  if (!section || !page) notFound();
  return <SectionListing section={section} page={page} />;
}
