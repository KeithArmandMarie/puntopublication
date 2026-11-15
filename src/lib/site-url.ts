/**
 * The public address of the site, used for share links and absolute URLs.
 *
 * Order: NEXT_PUBLIC_SITE_URL, then the production address Vercel provides,
 * then http://localhost:3000 in development only. In a production build with
 * none of these, there is no known address and this returns undefined, so
 * pages leave out links that would point to the wrong place.
 */

function clean(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  if (!trimmed) return undefined;
  const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(withProtocol).origin;
  } catch {
    return undefined;
  }
}

export function getSiteUrl(): string | undefined {
  return (
    clean(process.env.NEXT_PUBLIC_SITE_URL) ??
    clean(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    (process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined)
  );
}

/** Base for metadata, which always needs a value. Falls back to localhost. */
export function getMetadataBase(): URL {
  return new URL(getSiteUrl() ?? "http://localhost:3000");
}

/** "/article/x" becomes "https://example.com/article/x". Undefined when the site address is unknown. */
export function absoluteUrl(path: string): string | undefined {
  const base = getSiteUrl();
  return base ? `${base}${path}` : undefined;
}
