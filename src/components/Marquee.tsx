import Link from "next/link";

export type MarqueeItem = { label: string; href: string };

type MarqueeProps = {
  items: MarqueeItem[];
  /** Accessible name of the navigation, for example "Stories by municipality". */
  label: string;
  className?: string;
};

function Copy({ items, second = false }: { items: MarqueeItem[]; second?: boolean }) {
  return (
    <ul
      className="marquee-copy flex shrink-0 items-center"
      data-copy={second ? "second" : "first"}
      // The second copy only completes the loop. It is not read and cannot be focused.
      {...(second ? { "aria-hidden": true, inert: true } : {})}
    >
      {items.map((item) => (
        <li key={item.href} className="flex items-center">
          <Link
            href={item.href}
            className="inline-flex min-h-11 items-center px-6 py-3 text-3xl font-semibold tracking-tight text-foreground underline-offset-8 hover:underline"
          >
            {item.label}
          </Link>
          <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-brand" />
        </li>
      ))}
    </ul>
  );
}

/**
 * A slow, endless row of links in large type (CSS only, see `.marquee` in globals.css). It
 * pauses on hover and on focus. There is no pause button. Under reduced motion it does not
 * move: the links wrap.
 */
export function Marquee({ items, label, className = "" }: MarqueeProps) {
  if (items.length === 0) return null;

  return (
    <nav aria-label={label} className={className}>
      <div className="marquee overflow-hidden">
        <div className="marquee-track">
          <Copy items={items} />
          <Copy items={items} second />
        </div>
      </div>
    </nav>
  );
}
