import Link from "next/link";

type SectionHeadingProps = {
  title: string;
  /** Where "See all" goes. Leave out to hide the link. */
  href?: string;
  /** Accessible name for the link, for example "See all News stories". */
  linkLabel?: string;
  /** Heading level. Defaults to h2. */
  as?: "h2" | "h3";
  id?: string;
  className?: string;
};

/** A heading with a thin brown rule under it and an optional "See all" link. */
export function SectionHeading({
  title,
  href,
  linkLabel,
  as: Tag = "h2",
  id,
  className = "",
}: SectionHeadingProps) {
  return (
    <div
      className={`flex items-center justify-between gap-4 border-b border-brand-border pb-1 ${className}`.trim()}
    >
      <Tag id={id} className="text-xl font-bold">
        {title}
      </Tag>
      {href ? (
        <Link
          href={href}
          aria-label={linkLabel}
          className="link inline-flex min-h-11 shrink-0 items-center text-sm font-semibold"
        >
          See all
        </Link>
      ) : null}
    </div>
  );
}
