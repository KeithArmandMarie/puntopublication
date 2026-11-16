import { PostCard } from "@/components/PostCard";
import { Reveal } from "@/components/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { getPostsBySection } from "@/lib/content";
import { getSectionBySlug } from "@/lib/content/slugs";

type SectionBlockProps = {
  /** Section slug, for example "news". */
  slug: string;
};

/** A section on the home page: its heading, the newest story as a large card and the next three as compact cards. */
export function SectionBlock({ slug }: SectionBlockProps) {
  const section = getSectionBySlug(slug);
  const posts = getPostsBySection(slug);
  if (!section || posts.length === 0) return null;

  const [lead, ...rest] = posts;
  const headingId = `section-block-${slug}`;

  return (
    <Reveal>
    <section aria-labelledby={headingId}>
      <SectionHeading
        title={section.name}
        href={section.href}
        linkLabel={`See all ${section.name} stories`}
        id={headingId}
      />
      <div className="mt-4 grid gap-6 md:grid-cols-2">
        <PostCard
          post={lead}
          variant="large"
          sizes="(min-width: 1024px) 380px, (min-width: 768px) 50vw, 100vw"
        />
        {rest.length > 0 ? (
          <ul className="divide-y divide-border self-start">
            {rest.slice(0, 3).map((post) => (
              <li key={post.slug} className="py-4 first:pt-0 last:pb-0">
                <PostCard post={post} variant="compact" />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </section>
    </Reveal>
  );
}
