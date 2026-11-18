import type { ReactNode } from "react";
import { Container } from "@/components/Container";

type CallToActionProps = {
  /** The heading. Plain text, one short line. */
  title: string;
  /** One short paragraph under the heading. */
  children: ReactNode;
  /** One or two links. The first uses `buttonClasses("accent")`, the second `buttonClasses("secondary")`. */
  actions: ReactNode;
  /** Id for the heading, so the section is named by it. Must be unique on the page. */
  id: string;
  /** Heading level. Defaults to h2. */
  as?: "h2" | "h3";
  className?: string;
};

/**
 * A call to action panel: a `surface` panel with 12px corners across the 1200px grid, a large
 * heading, one paragraph and one or two buttons. Use it at most once per page, below the
 * content, for an action that is not reading (send a tip, follow, join). It only adds space
 * below itself, because the content above already ends with its own space.
 */
export function CallToAction({
  title,
  children,
  actions,
  id,
  as: Heading = "h2",
  className = "",
}: CallToActionProps) {
  return (
    <section aria-labelledby={id} className={`pb-section ${className}`.trim()}>
      <Container>
        <div className="rounded-md bg-surface px-6 py-10 md:flex md:items-end md:justify-between md:gap-10 md:px-14 md:py-16">
          <div>
            <Heading id={id} className="text-3xl font-semibold tracking-tight md:text-4xl">
              {title}
            </Heading>
            <p className="mt-4 max-w-article text-lg text-pretty text-muted">{children}</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3 md:mt-0 md:shrink-0">{actions}</div>
        </div>
      </Container>
    </section>
  );
}
