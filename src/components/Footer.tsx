import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/Container";
import { CurrentYear } from "@/components/CurrentYear";
import { Logo } from "@/components/Logo";
import {
  contactEmail,
  getSocialLinks,
  policyLinks,
  sections,
  siteName,
  tagline,
} from "@/config/site";

const linkClass =
  "inline-flex min-h-11 items-center text-on-brand underline-offset-4 hover:underline";

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <h2 className="text-base font-semibold">{title}</h2>
      {children}
    </div>
  );
}

/**
 * Site footer on the brand color. Social links, contact email and the
 * tagline only appear when they have a value in src/config/site.ts.
 */
export function Footer() {
  const social = getSocialLinks();
  const hasConnect = social.length > 0 || contactEmail.trim() !== "";

  return (
    <footer className="mt-auto bg-brand text-on-brand [--focus:var(--accent)]">
      <Container className="py-16 md:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Logo variant="footer" />
            {tagline.trim() !== "" && (
              <p className="mt-3 text-sm text-on-brand-muted">{tagline}</p>
            )}
          </div>

          <FooterColumn title="Sections">
            <ul className="mt-2">
              {sections.map((section) => (
                <li key={section.href}>
                  <Link href={section.href} className={linkClass}>
                    {section.name}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          <FooterColumn title="Policies">
            <ul className="mt-2">
              {policyLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterColumn>

          {hasConnect && (
            <FooterColumn title="Connect">
              <ul className="mt-2">
                {social.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      {link.label}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                ))}
                {contactEmail.trim() !== "" && (
                  <li>
                    <a href={`mailto:${contactEmail}`} className={linkClass}>
                      {contactEmail}
                    </a>
                  </li>
                )}
              </ul>
            </FooterColumn>
          )}
        </div>

        <div className="mt-14 border-t border-brand-border pt-6 text-sm text-on-brand-muted">
          <p>
            &copy; <CurrentYear /> {siteName}
          </p>
        </div>
      </Container>
    </footer>
  );
}
