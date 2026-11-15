import { formatDate } from "@/lib/format";

type PostDateProps = {
  /** "2026-11-13" or "2026-11-13T09:00:00+08:00". */
  iso: string;
  className?: string;
};

/** A date in Philippine time, in a time element so machines can read it. */
export function PostDate({ iso, className }: PostDateProps) {
  return (
    <time dateTime={iso} className={className}>
      {formatDate(iso)}
    </time>
  );
}
