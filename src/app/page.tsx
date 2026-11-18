import type { Metadata } from "next";
import Link from "next/link";
import { Banner } from "@/components/Banner";
import { BreakingStrip } from "@/components/BreakingStrip";
import { ButtonArrow, buttonClasses } from "@/components/Button";
import { Container } from "@/components/Container";
import { FacebookFeed, getFacebookPageUrl } from "@/components/FacebookFeed";
import { FeaturedSlider } from "@/components/FeaturedSlider";
import { GalleryHighlight } from "@/components/GalleryHighlight";
import { Marquee } from "@/components/Marquee";
import { MunicipalityGrid } from "@/components/MunicipalityGrid";
import { PostCard } from "@/components/PostCard";
import { SearchBlock } from "@/components/SearchBlock";
import { SectionHeading } from "@/components/SectionHeading";
import { StaffGrid } from "@/components/StaffGrid";
import { TopicStrip } from "@/components/TopicStrip";
import { pageImages } from "@/config/page-images";
import { logo, motto, municipalities, siteDescription, siteName, tagline } from "@/config/site";
import { getAllPosts, getFeaturedPosts } from "@/lib/content";
import { absoluteUrl } from "@/lib/site-url";

const title = `${siteName}: ${motto}`;

/** The motto, one sentence per line. */
const mottoLines = motto.split(/(?<=\.)\s+/);

export const metadata: Metadata = {
  title: { absolute: title },
  description: siteDescription,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName,
    title,
    description: siteDescription,
    locale: "en_PH",
    images: [{ url: logo.src, width: logo.width, height: logo.height, alt: `${siteName} seal` }],
  },
  twitter: {
    card: "summary",
    title,
    description: siteDescription,
    images: [logo.src],
  },
};

/** WebSite structured data. The address is left out when the site address is not known. */
function websiteJsonLd() {
  const url = absoluteUrl("/");
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    description: siteDescription,
    inLanguage: ["en", "tl"],
    ...(url ? { url } : {}),
  }).replace(/</g, "\\u003c");
}

export default function Home() {
  const all = getAllPosts();

  if (all.length === 0) {
    return (
      <Container className="py-section">
        <h1>{siteName}</h1>
        <p className="mt-3 max-w-prose text-muted">There are no stories yet. Please check back soon.</p>
      </Container>
    );
  }

  // Up to five featured stories. With none, the newest story stands in as the hero.
  const featured = getFeaturedPosts(5);
  const heroPosts = featured.length > 0 ? featured : [all[0]];
  const heroSlugs = new Set(heroPosts.map((post) => post.slug));

  // The newest stories that are not in the slider.
  const headlines = all.filter((post) => !heroSlugs.has(post.slug)).slice(0, 5);

  const hasFeed = getFacebookPageUrl() !== undefined;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: websiteJsonLd() }} />
      <Banner
        fullScreen
        image={pageImages.home.banner}
        above={<BreakingStrip />}
        title={mottoLines.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
        actions={
          <>
            <Link href="#top-stories" className={buttonClasses("accent")}>
              Read the top stories
              <ButtonArrow />
            </Link>
            <Link href="/archive" className={buttonClasses("onBrand")}>
              Browse the archive
              <ButtonArrow />
            </Link>
          </>
        }
      >
        {tagline}
      </Banner>

      {/* A slow row of the ten municipalities, each a link to the archive filtered by it. */}
      <div className="border-b border-border bg-surface">
        <Marquee
          label="Stories by municipality"
          items={municipalities.map((municipality) => ({
            label: municipality.name,
            href: municipality.href,
          }))}
        />
      </div>

      <Container className="py-section">
        <div
          id="top-stories"
          className="scroll-mt-header lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:grid-rows-[auto_1fr] lg:gap-x-8"
        >
          <section
            aria-labelledby="top-stories-heading"
            data-reveal
            className="lg:col-start-1 lg:row-start-1"
          >
            <h2 id="top-stories-heading" className="sr-only">
              Top stories
            </h2>
            {/*
              No story image gets priority here: the banner photo above is the first big
              image on the page and already loads at once.
            */}
            {heroPosts.length > 1 ? (
              <FeaturedSlider label="Featured stories">
                {heroPosts.map((post) => (
                  <PostCard
                    key={post.slug}
                    post={post}
                    variant="large"
                    headingLevel="h3"
                    hero
                    clamp
                  />
                ))}
              </FeaturedSlider>
            ) : (
              <PostCard post={heroPosts[0]} variant="large" headingLevel="h3" hero />
            )}
          </section>

          {/* Beside the lead story, the full height of the row: the latest headlines. */}
          {headlines.length > 0 ? (
            <section
              aria-labelledby="latest-headlines-heading"
              data-reveal
              className="mt-section lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:mt-0"
            >
              <SectionHeading title="Latest headlines" id="latest-headlines-heading" />
              <ul className="divide-y divide-border">
                {headlines.map((post) => (
                  <li key={post.slug} className="py-4">
                    <PostCard post={post} variant="compact" thumbnail={false} />
                  </li>
                ))}
              </ul>
              <Link
                href="/archive"
                className="link inline-flex min-h-11 items-center border-t border-border text-sm font-semibold"
              >
                See all published stories
              </Link>
            </section>
          ) : null}

          {/* Under the lead story: ways in (search and topics), side by side from 768px. */}
          <div
            data-reveal
            className="mt-section grid gap-10 md:grid-cols-2 md:gap-8 lg:col-start-1 lg:row-start-2 lg:mt-10 lg:content-start">
            <SearchBlock />
            <TopicStrip limit={10} />
          </div>
        </div>

        <div
          className={`mt-section ${
            hasFeed ? "lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8" : ""
          }`.trim()}
        >
          <div data-reveal className="space-y-section">
            <MunicipalityGrid />
            <GalleryHighlight />
          </div>

          {hasFeed ? (
            <div data-reveal className="mt-section lg:mt-0">
              <FacebookFeed />
            </div>
          ) : null}
        </div>

        <div className="mt-section">
          <StaffGrid limit={4} />
        </div>
      </Container>
    </>
  );
}
