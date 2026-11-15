import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  /** Address of a page, for example (n) => n === 1 ? "/section/news" : `/section/news/page/${n}`. */
  hrefForPage: (page: number) => string;
  /** Accessible name of the navigation. */
  label?: string;
};

type Entry = number | "gap-start" | "gap-end";

/** Page numbers to show: the first, the last, and the pages next to the current one. */
function entries(current: number, total: number): Entry[] {
  const wanted = new Set([1, total, current - 1, current, current + 1]);
  const pages = [...wanted].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const result: Entry[] = [];
  pages.forEach((page, index) => {
    const before = pages[index - 1];
    if (before !== undefined && page - before > 1) {
      result.push(page - before === 2 ? before + 1 : index < pages.length / 2 ? "gap-start" : "gap-end");
    }
    result.push(page);
  });
  return result;
}

const itemClass =
  "inline-flex min-h-11 min-w-11 items-center justify-center rounded-md border px-3 text-sm font-semibold";
const linkClass = `${itemClass} border-border-strong text-foreground underline-offset-4 hover:bg-surface hover:underline`;
const currentClass = `${itemClass} border-brand-border bg-brand text-on-brand`;
const disabledClass = `${itemClass} border-border text-muted`;

/**
 * Previous, page numbers and next, as plain links. No JavaScript.
 * Renders nothing when there is only one page. On phones the numbers
 * are replaced by "Page 2 of 5" so the row never overflows.
 */
export function Pagination({
  currentPage,
  totalPages,
  hrefForPage,
  label = "Pagination",
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const hasPrevious = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <nav aria-label={label} className="mt-12 border-t border-border pt-6">
      <ul className="flex flex-wrap items-center justify-between gap-2 sm:justify-center">
        <li>
          {hasPrevious ? (
            <Link href={hrefForPage(currentPage - 1)} rel="prev" className={linkClass}>
              Previous
            </Link>
          ) : (
            <span aria-disabled="true" className={disabledClass}>
              Previous
            </span>
          )}
        </li>

        <li className="text-sm text-muted sm:hidden">
          Page {currentPage} of {totalPages}
        </li>

        {entries(currentPage, totalPages).map((entry) => (
          <li key={entry} className="hidden sm:block">
            {typeof entry === "string" ? (
              <span aria-hidden="true" className="inline-flex min-h-11 items-center px-1 text-muted">
                ...
              </span>
            ) : entry === currentPage ? (
              <span aria-current="page" className={currentClass}>
                <span className="sr-only">Page </span>
                {entry}
              </span>
            ) : (
              <Link href={hrefForPage(entry)} className={linkClass}>
                <span className="sr-only">Page </span>
                {entry}
              </Link>
            )}
          </li>
        ))}

        <li>
          {hasNext ? (
            <Link href={hrefForPage(currentPage + 1)} rel="next" className={linkClass}>
              Next
            </Link>
          ) : (
            <span aria-disabled="true" className={disabledClass}>
              Next
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}
