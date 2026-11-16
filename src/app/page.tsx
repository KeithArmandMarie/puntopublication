import type { Metadata } from "next";
import Link from "next/link";
import { Banner } from "@/components/Banner";
import { BreakingStrip } from "@/components/BreakingStrip";
import { buttonClasses } from "@/components/Button";
import { Container } from "@/components/Container";
import { FacebookFeed, getFacebookPageUrl } from "@/components/FacebookFeed";
import { FeaturedSlider } from "@/components/FeaturedSlider";
import { GalleryHighlight } from "@/components/GalleryHighlight";
import { MunicipalityGrid } from "@/components/MunicipalityGrid";
import { PostCard } from "@/components/PostCard";
import { SearchBlock } from "@/components/SearchBlock";
import { StaffGrid } from "@/components/StaffGrid";
import { TopicStrip } from "@/components/TopicStrip";
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
        <div
          id="top-stories"
          className="scroll-mt-header lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8"
        >
          <section aria-labelledby="top-stories-heading">
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

          {/* Ways in, beside the lead story: search, then topics. */}
          <div className="mt-section space-y-10 lg:mt-0">
            <SearchBlock />
            <TopicStrip limit={10} />
          </div>
        </div>

        <div
          className={`mt-section ${
            hasFeed ? "lg:grid lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-8" : ""
          }`.trim()}
        >
          <div className="space-y-section">
            <MunicipalityGrid />
            <GalleryHighlight />
          </div>

          {hasFeed ? (
            <div className="mt-section lg:mt-0">
              <FacebookFeed />
            </div>
          ) : null}
        </div>

        <div className="mt-section">
          <StaffGrid />
        </div>
      </Container>
    </>
  );
}
