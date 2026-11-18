import type { ReactNode } from "react";
import { Container } from "@/components/Container";
import { PagePhoto } from "@/components/PagePhoto";
import type { PageImage } from "@/config/page-images";

type PageHeaderProps = {
  /** The page's h1. */
  title: ReactNode;
  /** One short paragraph, beside the title from 1024px. */
  children: ReactNode;
  /** The photo slot for this page, from `pageImages`. An empty `src` shows a placeholder band. */
  image: PageImage;
};

/**
 * The top of an inner page: a large h1 on the left and one short paragraph on the right
 * (stacked on phones), then a tall photo band with 12px corners across the 1200px grid. Every
 * page that is not the home page or a story starts with it, so each page has a photo. Place it
 * before the page's `Container`, not inside it.
 */
export function PageHeader({ title, children, image }: PageHeaderProps) {
  return (
    <header>
      <Container className="pb-10 pt-12 md:pb-14 md:pt-section">
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-8">
          <h1 className="lg:col-span-8 lg:text-5xl">{title}</h1>
          <p className="mt-6 text-xl text-pretty text-muted lg:col-span-4 lg:mt-0">{children}</p>
        </div>
      </Container>
      <Container>
        <PagePhoto image={image} ratio="band" sizes="(min-width: 1200px) 1200px, 100vw" priority />
      </Container>
    </header>
  );
}
