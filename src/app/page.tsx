import type { Metadata } from "next";
import Link from "next/link";
import { Banner } from "@/components/Banner";
import { BreakingStrip } from "@/components/BreakingStrip";
import { buttonClasses } from "@/components/Button";
import { Container } from "@/components/Container";
import { FacebookFeed, getFacebookPageUrl } from "@/components/FacebookFeed";
import { FeaturedSlider } from "@/components/FeaturedSlider";
import { GalleryHighlight } from "@/components/GalleryHighlight";
import { MunicipalityStrip } from "@/components/MunicipalityStrip";
import { PostCard } from "@/components/PostCard";
import { Reveal } from "@/components/Reveal";
import { SectionBlock } from "@/components/SectionBlock";
import { SectionHeading } from "@/components/SectionHeading";
import { logo, motto, siteDescription, siteName, tagline } from "@/config/site";
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

const HOME_SECTIONS = ["news", "features", "opinion"] as const;

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

  const headlines = all.filter((post) => !heroSlugs.has(post.slug)).slice(0, 4);
  const shownSlugs = new Set([...heroSlugs, ...headlines.map((post) => post.slug)]);
  const latest = all.filter((post) => !shownSlugs.has(post.slug)).slice(0, 6);

  const hasFeed = getFacebookPageUrl() !== undefined;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: websiteJsonLd() }} />
      <Banner
        fullScreen
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
            </Link>
            <Link href="/archive" className={buttonClasses("onBrand")}>
              Browse the archive
            </Link>
          </>
        }
      >
        {tagline}
      </Banner>

      <Container className="pb-section pt-8 md:pt-section">
        <section
          id="top-stories"
          aria-labelledby="top-stories-heading"
          className="scroll-mt-header lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8"
        >
          <h2 id="top-stories-heading" className="sr-only">
            Top stories
          </h2>
          {/*
            No image gets priority here: the full screen banner fills the first screen,
            so the first image on screen is the header logo, which already has it.
          */}
          {heroPosts.length > 1 ? (
            <FeaturedSlider label="Featured stories">
              {heroPosts.map((post) => (
                <PostCard
                  key={post.slug}
                  post={post}
                  variant="large"
                  headingLevel="h2"
                  hero
                  clamp
                />
              ))}
            </FeaturedSlider>
          ) : (
            <PostCard post={heroPosts[0]} variant="large" headingLevel="h2" hero />
          )}

          {headlines.length > 0 ? (
            <Reveal className="mt-10 lg:mt-0">
            <section aria-labelledby="latest-headlines-heading">
              <SectionHeading title="Latest headlines" id="latest-headlines-heading" />
              <ul className="divide-y divide-border">
                {headlines.map((post) => (
                  <li key={post.slug} className="py-4">
                    <PostCard post={post} variant="compact" thumbnail={false} />
                  </li>
                ))}
              </ul>
            </section>
            </Reveal>
          ) : null}
        </section>

        {latest.length > 0 ? (
          <section aria-labelledby="latest-stories-heading" className="mt-section">
            <SectionHeading
              title="Latest stories"
              href="/archive"
              linkLabel="See all stories in the archive"
              id="latest-stories-heading"
            />
            <div className="mt-6 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((post) => (
                <Reveal key={post.slug}>
                  <PostCard post={post} variant="standard" />
                </Reveal>
              ))}
            </div>
          </section>
        ) : null}

        <div
          className={`mt-section ${
            hasFeed ? "lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8" : ""
          }`.trim()}
        >
          <div className="space-y-section">
            {HOME_SECTIONS.map((slug) => (
              <SectionBlock key={slug} slug={slug} />
            ))}
            <MunicipalityStrip />
            <GalleryHighlight />
          </div>

          {hasFeed ? (
            <div className="mt-section lg:mt-0">
              <FacebookFeed />
            </div>
          ) : null}
        </div>
      </Container>
    </>
  );
}
