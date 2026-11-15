import Link from "next/link";
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
  /** Links to the section and municipality pages. Leave off inside a card, where the whole card is one link. */
  linked?: boolean;
  className?: string;
};

/**
 * Section label, municipality label and, for Tagalog posts, a language badge.
 * Inside a card the labels are plain text. On the article page they are links.
 */
export function PostLabels({ post, linked = false, className = "" }: PostLabelsProps) {
  const section = getSectionBySlug(post.section);
  const municipality = getMunicipalityBySlug(post.municipality);

  const linkClass =
    "inline-flex min-h-11 items-center underline underline-offset-4 hover:text-link-hover";

  return (
    <p
      className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-sm ${className}`.trim()}
    >
      {section ? (
        linked ? (
          <Link href={section.href} className={`${linkClass} font-bold text-link`}>
            {section.name}
          </Link>
        ) : (
          <span className="font-bold text-foreground">{section.name}</span>
        )
      ) : null}
      {municipality ? (
        linked ? (
          <Link href={municipality.href} className={`${linkClass} text-muted`}>
            {municipality.name}
          </Link>
        ) : (
          <span className="text-muted">{municipality.name}</span>
        )
      ) : null}
      <LanguageBadge language={post.language} />
    </p>
  );
}
