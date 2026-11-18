import { getMunicipalityBySlug, getSectionBySlug } from "@/lib/content/slugs";
import type { Language } from "@/lib/content/schema";

/** Small yellow fill with brown text. Only for Tagalog posts. */
export function LanguageBadge({ language }: { language: Language }) {
  if (language !== "tl") return null;
  return (
    <span className="rounded-sm bg-accent px-2 text-xs font-semibold text-on-accent">
      Tagalog
    </span>
  );
}

type PostLabelsProps = {
  post: { section: string; municipality: string; language: Language };
  className?: string;
};

/**
 * Section label, municipality label and, for Tagalog posts, a language badge.
 * Plain text, because inside a card the whole card is one link.
 */
export function PostLabels({ post, className = "" }: PostLabelsProps) {
  const section = getSectionBySlug(post.section);
  const municipality = getMunicipalityBySlug(post.municipality);

  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm ${className}`.trim()}>
      {section ? <span className="font-semibold text-foreground">{section.name}</span> : null}
      {municipality ? <span className="text-muted">{municipality.name}</span> : null}
      <LanguageBadge language={post.language} />
    </p>
  );
}
