import type { ImageRatio } from "@/components/PlaceholderImage";
import { PostImage } from "@/components/PostImage";
import type { PageImage } from "@/config/page-images";

type PagePhotoProps = {
  /** A slot from `pageImages` in `src/config/page-images.ts`. */
  image: PageImage;
  /** Required. Tells the browser how wide the photo is shown, for example "(min-width: 1024px) 480px, 100vw". */
  sizes: string;
  /** Defaults to 3/2. Use "band" for the full width strip under a page title. */
  ratio?: ImageRatio;
  /** Only for the first image on a page. */
  priority?: boolean;
  className?: string;
  /** Classes for the credit line, for example "container-page" to line it up with the page grid. */
  captionClassName?: string;
};

/**
 * A photo for a page slot, as a `figure`. No `src` shows the placeholder block, which takes
 * the same space. A photo must have alt text, which is checked at build time and fails
 * the build when missing.
 */
export function PagePhoto({
  image,
  sizes,
  ratio = "3/2",
  priority = false,
  className = "",
  captionClassName = "",
}: PagePhotoProps) {
  const src = image.src.trim();
  const credit = image.credit?.trim();

  if (src && image.alt.trim() === "") {
    throw new Error(`Page photo "${src}" needs alt text. Set "alt" in src/config/page-images.ts.`);
  }

  return (
    <figure className={className}>
      <PostImage image={{ src, alt: image.alt }} ratio={ratio} sizes={sizes} priority={priority} />
      {src && credit ? (
        <figcaption className={`mt-2 text-sm text-muted ${captionClassName}`.trim()}>
          Photo: {credit}
        </figcaption>
      ) : null}
    </figure>
  );
}
