import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { sections } from "@/config/site";
import { getSectionBySlug } from "@/lib/content/slugs";
import { SectionListing, sectionMetadata } from "./SectionListing";

export const dynamicParams = false;

export function generateStaticParams() {
  return sections.map((section) => ({ slug: section.slug }));
}

export async function generateMetadata({ params }: PageProps<"/section/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const section = getSectionBySlug(slug);
  return section ? sectionMetadata(section, 1) : {};
}

export default async function SectionPage({ params }: PageProps<"/section/[slug]">) {
  const { slug } = await params;
  const section = getSectionBySlug(slug);
  if (!section) notFound();
  return <SectionListing section={section} page={1} />;
}
