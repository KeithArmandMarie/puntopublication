import { buttonClasses } from "@/components/Button";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { WebShareButton } from "@/components/WebShareButton";
import { absoluteUrl } from "@/lib/site-url";

type ShareRowProps = {
  /** Path of the page, for example "/article/my-story". */
  path: string;
  title: string;
};

/**
 * Share links for a story. Facebook and X are plain links with no third party
 * script. They need the public site address (NEXT_PUBLIC_SITE_URL), so they are
 * left out when it is not known. Copy link and Share fall back to the address
 * of the open page.
 */
export function ShareRow({ path, title }: ShareRowProps) {
  const url = absoluteUrl(path);

  const facebook = url
    ? `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: url }).toString()}`
    : undefined;
  const x = url
    ? `https://x.com/intent/post?${new URLSearchParams({ url, text: title }).toString()}`
    : undefined;

  return (
    <section aria-labelledby="share-heading">
      <h2 id="share-heading" className="mb-3 text-lg font-bold">
        Share this story
      </h2>
      <div className="flex flex-wrap items-center gap-2">
        {facebook ? (
          <a href={facebook} target="_blank" rel="noopener noreferrer" className={buttonClasses("secondary")}>
            Facebook
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}
        {x ? (
          <a href={x} target="_blank" rel="noopener noreferrer" className={buttonClasses("secondary")}>
            X<span className="sr-only"> (opens in a new tab)</span>
          </a>
        ) : null}
        <CopyLinkButton url={url} />
        <WebShareButton title={title} url={url} />
      </div>
    </section>
  );
}
