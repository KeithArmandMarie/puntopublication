import { Chip } from "@/components/Chip";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllTags } from "@/lib/content";

type TopicStripProps = {
  /** How many topics to show. Defaults to 12. */
  limit?: number;
};

/** Plain text chips for the tags used most in published stories. Renders nothing without tags. */
export function TopicStrip({ limit = 12 }: TopicStripProps) {
  const tags = getAllTags().slice(0, limit);
  if (tags.length === 0) return null;

  return (
    <section aria-labelledby="topic-strip-heading">
      <SectionHeading title="Topics" id="topic-strip-heading" />
      <ul className="mt-4 flex flex-wrap gap-2">
        {tags.map(({ tag, slug }) => (
          <li key={slug}>
            <Chip href={`/tag/${slug}`}>{tag}</Chip>
          </li>
        ))}
      </ul>
    </section>
  );
}
