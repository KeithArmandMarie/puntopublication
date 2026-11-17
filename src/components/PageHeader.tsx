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
 * The top of an inner page: the h1 on the left and one short paragraph on the right (stacked
 * on phones), then a photo band across the full width of the screen. Every page that is not
 * the home page or a story starts with it, so each page has a photo. Place it before the
 * page's `Container`, not inside it, so the band reaches both screen edges.
 */
export function PageHeader({ title, children, image }: PageHeaderProps) {
  return (
    <header>
      <Container className="py-8 md:py-section">
        <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-8">
          <h1 className="lg:col-span-7">{title}</h1>
          <p className="mt-4 max-w-article text-lg text-pretty text-muted lg:col-span-5 lg:mt-0">
            {children}
          </p>
        </div>
      </Container>
      <PagePhoto image={image} ratio="band" sizes="100vw" priority captionClassName="container-page" />
    </header>
  );
}
