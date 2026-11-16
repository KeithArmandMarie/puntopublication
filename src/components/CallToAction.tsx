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
 * A full width call to action band: surface fill, thin rules above and below,
 * a heading, one paragraph and one or two buttons. Use it at most once per page,
 * below the content, for an action that is not reading (send a tip, follow, join).
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
    <section
      aria-labelledby={id}
      className={`border-y border-border bg-surface ${className}`.trim()}
    >
      <Container className="py-section md:flex md:items-end md:justify-between md:gap-8">
        <div>
          <Heading id={id} className="text-2xl font-bold">
            {title}
          </Heading>
          <p className="mt-3 max-w-article text-pretty text-muted">{children}</p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3 md:mt-0 md:shrink-0">{actions}</div>
      </Container>
    </section>
  );
}
