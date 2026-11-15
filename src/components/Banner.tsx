import type { ReactNode } from "react";
import { Container } from "@/components/Container";

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
  className = "",
}: BannerProps) {
  return (
    <div className={fullScreen ? fullScreenFrame : undefined}>
      {above}
      <div
        className={`bg-brand text-on-brand [--focus:var(--accent)] ${
          fullScreen ? "flex flex-1 flex-col justify-center" : ""
        } ${className}`.trim()}
      >
        <Container className={fullScreen ? "w-full py-section" : "py-8 md:py-section"}>
          <h1 className={fullScreen ? "max-w-prose text-4xl" : "max-w-prose"}>{title}</h1>
          <p className="mt-4 max-w-prose text-lg text-on-brand-muted">{children}</p>
          {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
        </Container>
      </div>
    </div>
  );
}
