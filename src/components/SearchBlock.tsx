import { Button } from "@/components/Button";
import { controlClasses } from "@/components/Field";
import { SectionHeading } from "@/components/SectionHeading";
import { searchHref } from "@/config/site";

type SearchBlockProps = {
  /** Id prefix, unique on the page. Defaults to "find-story". */
  id?: string;
};

/** "Find a story": a labelled search field and a button. Sends `q` to the search page. */
export function SearchBlock({ id = "find-story" }: SearchBlockProps) {
  const headingId = `${id}-heading`;
  const inputId = `${id}-input`;

  return (
    <section aria-labelledby={headingId}>
      <SectionHeading title="Find a story" id={headingId} />
      <form action={searchHref} method="get" role="search" className="mt-4">
        <label htmlFor={inputId} className="text-sm font-semibold">
          Search by word, name of a town or topic
        </label>
        <div className="mt-1 flex gap-2">
          <input
            id={inputId}
            name="q"
            type="search"
            autoComplete="off"
            enterKeyHint="search"
            required
            className={controlClasses}
          />
          <Button type="submit" variant="primary" className="shrink-0">
            Search
          </Button>
        </div>
      </form>
    </section>
  );
}
