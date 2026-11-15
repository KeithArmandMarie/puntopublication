import { SectionHeading } from "@/components/SectionHeading";

/** Width of the Facebook plugin in pixels. The right hand column (--container-aside) is the same width. */
const FEED_WIDTH = 300;
const FEED_HEIGHT = 600;

/** The page address from NEXT_PUBLIC_FB_PAGE_URL, or undefined when it is empty or not a Facebook address. */
export function getFacebookPageUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_FB_PAGE_URL?.trim();
  if (!raw) return undefined;
  try {
    const url = new URL(raw);
    const host = url.hostname.toLowerCase();
    const isFacebook = host === "facebook.com" || host.endsWith(".facebook.com") || host === "fb.com";
    return url.protocol === "https:" && isFacebook ? url.toString() : undefined;
  } catch {
    return undefined;
  }
}

/**
 * The official Facebook Page Plugin as a plain, lazy loaded iframe. No Facebook
 * script is loaded. The page address comes from NEXT_PUBLIC_FB_PAGE_URL and the
 * block is hidden when it is empty. A text link to the page always sits below.
 */
export function FacebookFeed() {
  const href = getFacebookPageUrl();
  if (!href) return null;

  const src =
    "https://www.facebook.com/plugins/page.php?" +
    new URLSearchParams({
      href,
      tabs: "timeline",
      width: String(FEED_WIDTH),
      height: String(FEED_HEIGHT),
      small_header: "true",
      adapt_container_width: "true",
      hide_cover: "false",
      show_facepile: "false",
    }).toString();

  return (
    <aside aria-labelledby="facebook-feed-heading">
      <SectionHeading title="On Facebook" id="facebook-feed-heading" />
      <iframe
        src={src}
        title="Posts from our Facebook page"
        width={FEED_WIDTH}
        height={FEED_HEIGHT}
        loading="lazy"
        referrerPolicy="origin-when-cross-origin"
        className="mt-4 block max-w-full border border-border bg-surface"
      />
      <a
        href={href}
        rel="noopener noreferrer"
        className="link mt-2 inline-flex min-h-11 items-center text-sm font-semibold"
      >
        Open our Facebook page
      </a>
    </aside>
  );
}
