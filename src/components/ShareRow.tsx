import { buttonClasses } from "@/components/Button";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { NativeShareButton } from "@/components/NativeShareButton";
import { absoluteUrl } from "@/lib/site-url";

type ShareRowProps = {
  /** The headline, used as the share text. */
  title: string;
  /** The page path, for example "/article/my-story". */
  path: string;
  className?: string;
};

/**
 * Ways to share a story. Facebook and X are plain links with no third party
 * scripts. They need the public site address, so without one they are left out
 * (a link to the wrong address is worse than no link) and Copy link and Share
 * fall back to the address the reader is on.
 */
export function ShareRow({ title, path, className = "" }: ShareRowProps) {
  const url = absoluteUrl(path);
  const encodedUrl = url ? encodeURIComponent(url) : "";
  const links = url
    ? [
        {
          label: "Share on Facebook",
          href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        },
        {
          label: "Share on X",
          href: `https://x.com/intent/post?url=${encodedUrl}&text=${encodeURIComponent(title)}`,
        },
      ]
    : [];

  return (
    <div role="group" aria-labelledby="share-heading" className={className}>
      <p id="share-heading" className="text-sm font-bold">
        Share this story
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClasses("secondary")}
          >
            {link.label}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        ))}
        <CopyLinkButton path={path} url={url} />
        <NativeShareButton title={title} path={path} url={url} />
      </div>
    </div>
  );
}
