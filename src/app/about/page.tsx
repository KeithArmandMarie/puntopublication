import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Chip } from "@/components/Chip";
import { Container } from "@/components/Container";
import { getFacebookPageUrl } from "@/components/FacebookFeed";
import { PageHeader } from "@/components/PageHeader";
import { PagePhoto } from "@/components/PagePhoto";
import { SectionHeading } from "@/components/SectionHeading";
import { StaffGrid } from "@/components/StaffGrid";
import { facebookMessageUrl } from "@/components/StoryTipCta";
import { contactEmail, sections, siteName } from "@/config/site";
import { pageImages } from "@/config/page-images";

const description = `${siteName}, the Provincial Youth Journalist Publication of Davao del Sur: who we are, our vision and mission, what we do and how to reach us.`;

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
};

/** Provided by the client, word for word. */
const vision =
  "To cultivate a generation of empowered, responsible, and socially conscious young journalists and volunteers who embody truth, creativity, leadership, and service in building stronger communities in Davao del Sur and the nation.";
const mission =
  "Punto is committed to empowering young people through journalism, volunteerism, leadership, community service, and meaningful youth participation by providing opportunities to learn, collaborate, communicate, serve, and create positive change.";

const platforms = [
  {
    name: "Punto Broadcast",
    text: "Produces high-impact video reports covering local events and provincial news across Davao del Sur, for a closer look at the news of the province.",
    image: pageImages.about.broadcast,
  },
  {
    name: "Punto Print",
    text: "Publishes deep-dive feature stories, editorial pieces and community-focused articles written by young reporters.",
    image: pageImages.about.print,
    href: "/archive",
    linkLabel: "Read the stories in the archive",
  },
  {
    name: "Inter-School Collaboration",
    text: "Connects campus journalists from various schools in Davao del Sur to share stories and amplify youth voices beyond individual school papers.",
    image: pageImages.about.collaboration,
  },
] as const;

function Block({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section aria-labelledby={id}>
      <SectionHeading title={title} id={id} />
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Ways to get in touch. Only addresses that exist are shown, and the block is hidden without any. */
function ReachUs() {
  const facebook = getFacebookPageUrl();
  const email = contactEmail.trim();
  if (!facebook && !email) return null;

  const linkClass = "link inline-flex min-h-11 items-center font-semibold";

  return (
    <Block id="about-reach" title="How to reach us">
      <p className="max-w-article">
        News tips, story ideas and photos from your town are welcome. Stay connected. Stay informed.
      </p>
      <ul className="mt-2">
        {facebook ? (
          <>
            <li>
              <a
                href={facebookMessageUrl(facebook)}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Send a message on Facebook
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={facebook} target="_blank" rel="noopener noreferrer" className={linkClass}>
                Follow our Facebook page
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </>
        ) : null}
        {email ? (
          <li>
            <a href={`mailto:${email}`} className={linkClass}>
              {email}
            </a>
          </li>
        ) : null}
      </ul>
    </Block>
  );
}

/**
 * `/about`: the whole 1200px grid. A photo band under the title (`PageHeader`), a split row of
 * text and photo, the vision and mission as large type, three platforms with a photo each,
 * the promise as a full width brand band, a split row with the sections, the team and how to
 * reach us. Everything is the client's own text or the site's real data. No history, dates or
 * numbers are stated, because none were provided. Photos are placeholders until real files
 * are set in `src/config/page-images.ts`.
 */
export default function AboutPage() {
  return (
    <>
      <PageHeader title={`About ${siteName}`} image={pageImages.about.header}>
        Your window to Davao del Sur.
      </PageHeader>

      <Container className="space-y-section pt-section">
        <section aria-labelledby="about-who" className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <SectionHeading title="Who we are" id="about-who" />
            <div className="mt-4 max-w-article space-y-4">
              <p className="text-xl font-medium">
                Welcome to the official digital home of Punto Publication, the Provincial Youth
                Journalist Publication of Davao del Sur.
              </p>
              <p>
                We are a collective of dedicated journalists, visual storytellers and creative minds,
                committed to delivering news that matters.
              </p>
              <p>
                We work to bridge the gap between information and the community through rigorous
                reporting and innovative multimedia, in print and on video.
              </p>
            </div>
          </div>
          <div className="mt-8 lg:col-span-5 lg:mt-0">
            <PagePhoto
              image={pageImages.about.who}
              ratio="4/3"
              sizes="(min-width: 1024px) 480px, 100vw"
            />
          </div>
        </section>

        <section aria-labelledby="about-vision-mission">
          <SectionHeading title="Our vision and mission" id="about-vision-mission" />
          <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
            <div className="border-t border-brand-border pt-4">
              <h3>Vision</h3>
              <p className="mt-3 text-xl font-medium leading-snug">{vision}</p>
            </div>
            <div className="border-t border-brand-border pt-4">
              <h3>Mission</h3>
              <p className="mt-3 text-xl font-medium leading-snug">{mission}</p>
            </div>
          </div>
        </section>

        <section aria-labelledby="about-do">
          <SectionHeading title="What we do" id="about-do" />
          <ul className="mt-6 grid gap-8 md:grid-cols-3">
            {platforms.map((platform) => (
              <li key={platform.name}>
                <PagePhoto
                  image={platform.image}
                  ratio="3/2"
                  sizes="(min-width: 1024px) 384px, (min-width: 768px) 33vw, 100vw"
                />
                <h3 className="mt-4">{platform.name}</h3>
                <p className="mt-2">{platform.text}</p>
                {"href" in platform ? (
                  <Link
                    href={platform.href}
                    className="link inline-flex min-h-11 items-center text-sm font-semibold"
                  >
                    {platform.linkLabel}
                  </Link>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </Container>

      <section
        aria-labelledby="about-promise"
        className="mt-section bg-brand text-on-brand [--focus:var(--accent)]"
      >
        <Container className="py-section lg:grid lg:grid-cols-12 lg:gap-8">
          <h2 id="about-promise" className="text-xl font-bold lg:col-span-4">
            Our promise
          </h2>
          <div className="mt-4 lg:col-span-8 lg:mt-0">
            <p className="text-3xl font-extrabold tracking-tight md:text-4xl">
              Truth in every post. Storytelling in every frame.
            </p>
            <p lang="ceb" className="mt-6 max-w-article text-lg text-on-brand-muted">
              Kay sa Punto Publication, ang kamatuoran maoy mag-una. Kuyog ta sa paghatag og tingog
              para sa Maanyag nga Davao del Sur!
            </p>
          </div>
        </Container>
      </section>

      <Container className="space-y-section py-section">
        <section aria-labelledby="about-publish" className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <SectionHeading title="What we publish" id="about-publish" />
            <p className="mt-4 max-w-article">
              Every story is filed under one of six sections. Pick one to see its stories in the
              archive.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {sections.map((section) => (
                <li key={section.slug}>
                  <Chip href={section.href}>{section.name}</Chip>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 lg:order-first lg:col-span-5 lg:mt-0">
            <PagePhoto
              image={pageImages.about.publish}
              ratio="4/3"
              sizes="(min-width: 1024px) 480px, 100vw"
            />
          </div>
        </section>

        <StaffGrid />

        <ReachUs />
      </Container>
    </>
  );
}
