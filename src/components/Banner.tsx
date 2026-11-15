import type { ReactNode } from "react";
import { Container } from "@/components/Container";

type BannerProps = {
  /** The page's h1. */
  title: string;
  /** The paragraph under the title. */
  children: ReactNode;
  /** One or two links or buttons. Style them with `buttonClasses("accent")` and `buttonClasses("onBrand")`. */
  actions?: ReactNode;
  className?: string;
};

/**
 * The standard banner: a flat brand colored band with the page h1, one paragraph
 * and up to two calls to action. Use it once, at the top of a page. The focus
 * ring is yellow here, as in the footer, because the brown ring would vanish on brown.
 */
export function Banner({ title, children, actions, className = "" }: BannerProps) {
  return (
    <div
      className={`bg-brand text-on-brand [--focus:var(--accent)] ${className}`.trim()}
    >
      <Container className="py-8 md:py-section">
        <h1 className="max-w-prose">{title}</h1>
        <p className="mt-3 max-w-prose text-on-brand-muted">{children}</p>
        {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
      </Container>
    </div>
  );
}
