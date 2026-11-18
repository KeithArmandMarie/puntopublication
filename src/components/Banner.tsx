import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/Container";
import { Parallax } from "@/components/Parallax";

type BannerProps = {
  /** The page's h1. May hold `<span className="block">` lines. */
  title: ReactNode;
  /** The paragraph under the title. */
  children: ReactNode;
  /** One or two links or buttons. Style them with `buttonClasses("accent")` and `buttonClasses("onBrand")`. */
  actions?: ReactNode;
  /**
   * Something that sits above the band, such as the breaking strip. With `fullScreen`
   * it counts toward the screen height, so the banner gives up that much space.
   */
  above?: ReactNode;
  /**
   * Fills the first screen: `above` and the banner together are as tall as the viewport
   * below the header (small viewport height, so phone address bars do not cut it). The text
   * is centered vertically and the title uses the largest size.
   */
  fullScreen?: boolean;
  /**
   * A photo for the whole banner background (a slot from `pageImages`, with alt text). A flat
   * scrim (`--scrim` at `--scrim-opacity`) sits between the photo and the text, so the text has the same contrast on
   * every part of the photo, whatever the photo is (checked by `npm run contrast`, worst case
   * a white photo). No gradient, no blur. The photo is the first big image on the page, so it
   * loads at once. An empty `src` leaves the plain brand colored band.
   */
  image?: { src: string; alt: string };
  className?: string;
};

const fullScreenFrame =
  "flex min-h-[calc(100svh-var(--utility-height)-var(--header-height))] flex-col";

/**
 * The standard banner: a flat brand colored band with the page h1, one paragraph
 * and up to two calls to action. Use it once, at the top of a page. The focus
 * ring is yellow here, as in the footer, because the brown ring would vanish on brown.
 */
export function Banner({
  title,
  children,
  actions,
  above,
  fullScreen = false,
  image,
  className = "",
}: BannerProps) {
  const photo = image?.src.trim() ? image : undefined;
  if (photo && photo.alt.trim() === "") {
    throw new Error(`Banner photo "${photo.src}" needs alt text. Set "alt" in src/config/page-images.ts.`);
  }

  const band = `bg-brand text-on-brand [--focus:var(--accent)] ${
    fullScreen ? "flex flex-1 flex-col justify-center" : ""
  } ${className}`.trim();
  const padding = fullScreen ? "w-full py-section" : "py-8 md:py-section";

  const text = (
    <>
      <h1
        className={
          fullScreen ? "max-w-5xl text-display tracking-tighter" : "max-w-prose"
        }
      >
        {title}
      </h1>
      <p
        className={`max-w-article text-pretty ${fullScreen ? "mt-6 text-xl" : "mt-4 text-lg"} ${photo ? "text-on-brand" : "text-on-brand-muted"}`}
      >
        {children}
      </p>
      {actions ? <div className="mt-10 flex flex-wrap gap-3">{actions}</div> : null}
    </>
  );

  return (
    <div className={fullScreen ? fullScreenFrame : undefined}>
      {above}
      {photo ? (
        <div className={`relative isolate overflow-hidden ${band}`}>
          {/* Light parallax: the photo moves a little slower than the page. The box carries the z index, because it is its own stacking context. */}
          <Parallax className="-z-20">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </Parallax>
          {/* The scrim: --scrim at --scrim-opacity, one flat layer. Utilities, not a custom class, so it never depends on a stale CSS rebuild. */}
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-(--scrim) opacity-(--scrim-opacity)" />
          <Container className={padding}>{text}</Container>
        </div>
      ) : (
        <div className={band}>
          <Container className={padding}>{text}</Container>
        </div>
      )}
    </div>
  );
}
