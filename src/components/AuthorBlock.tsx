import { InitialsBadge } from "@/components/InitialsBadge";
import { fullName } from "@/lib/content";
import type { StaffMember } from "@/lib/content";

type AuthorBlockProps = {
  authors: StaffMember[];
  className?: string;
};

/**
 * Who wrote the story: full name and position, with the initials badge.
 * No photos or links here.
 */
export function AuthorBlock({ authors, className = "" }: AuthorBlockProps) {
  if (authors.length === 0) return null;
  return (
    <section aria-labelledby="authors-heading" className={className}>
      <p id="authors-heading" className="text-sm font-bold">
        Written by
      </p>
      <ul className="mt-3 space-y-3">
        {authors.map((author) => (
          <li key={author.id} className="flex items-center gap-3">
            <InitialsBadge name={author.firstName} />
            <p className="min-w-0">
              <span className="block font-bold">{fullName(author)}</span>
              <span className="block text-sm text-muted">{author.position}</span>
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
