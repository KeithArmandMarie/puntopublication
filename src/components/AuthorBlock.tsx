import { InitialsBadge } from "@/components/InitialsBadge";
import type { StaffMember } from "@/lib/content";

type AuthorBlockProps = {
  authors: StaffMember[];
};

/** First names and positions only. No photos, no last names, no links to author pages. */
export function AuthorBlock({ authors }: AuthorBlockProps) {
  if (authors.length === 0) return null;

  return (
    <section aria-labelledby="authors-heading">
      <h2 id="authors-heading" className="mb-3 text-lg font-bold">
        Written by
      </h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {authors.map((author) => (
          <li key={author.id} className="flex items-center gap-3">
            <InitialsBadge firstName={author.firstName} />
            <p>
              <span className="block font-bold">{author.firstName}</span>
              <span className="block text-sm text-muted">{author.position}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
