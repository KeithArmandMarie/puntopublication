import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { municipalities } from "@/config/site";
import { getPostsByMunicipality } from "@/lib/content";

function storyCount(count: number): string {
  if (count === 0) return "No stories yet";
  return count === 1 ? "1 story" : `${count} stories`;
}

/**
 * "Stories by municipality": one tile per municipality with its name and its real
 * story count. Each tile is one link. "See all" goes to the municipality index.
 */
export function MunicipalityGrid() {
  return (
    <section aria-labelledby="municipality-grid-heading">
      <SectionHeading title="Stories by municipality" id="municipality-grid-heading" />
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {municipalities.map((municipality) => (
          <li key={municipality.slug}>
            <Link
              href={municipality.href}
              className="group flex min-h-28 flex-col justify-between gap-2 rounded-md bg-surface p-4 text-foreground underline-offset-4 transition-colors duration-(--duration-fast) ease-out hover:bg-border"
            >
              <span className="font-semibold group-hover:underline">{municipality.name}</span>
              <span className="text-sm text-muted">
                {storyCount(getPostsByMunicipality(municipality.slug).length)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
