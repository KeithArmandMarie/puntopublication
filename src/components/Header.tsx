import Link from "next/link";
import { Container } from "@/components/Container";
import { SearchIcon } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { MobileMenu } from "@/components/MobileMenu";
import { NavLink } from "@/components/NavLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TodayDate } from "@/components/TodayDate";
import { mainNav, searchHref } from "@/config/site";

/**
 * Site header. The utility bar (date, theme, search) scrolls away.
 * The main bar (logo and navigation) stays at the top: the header is sticky
 * and shifted up by the height of the utility bar.
 */
export function Header() {
  return (
    <header className="sticky top-[calc(-1*var(--utility-height))] z-40">
      <div className="h-utility border-b border-border bg-surface">
        <Container className="flex h-full items-center justify-between gap-3">
          <TodayDate />
          <div className="flex items-center">
            <ThemeToggle />
            <Link
              href={searchHref}
              aria-label="Search"
              className="press inline-flex size-11 items-center justify-center rounded-md text-foreground hover:bg-border"
            >
              <SearchIcon />
            </Link>
          </div>
        </Container>
      </div>

      <div className="border-b border-border bg-background">
        <Container className="flex h-header items-center justify-between gap-6">
          <Logo />
          <nav aria-label="Main" className="hidden lg:block">
            <ul className="flex items-center">
              {mainNav.map((entry) => (
                <li key={entry.href}>
                  <NavLink
                    href={entry.href}
                    className="inline-flex min-h-11 items-center px-3 text-sm font-semibold text-foreground underline-offset-4 hover:underline aria-[current=page]:underline"
                  >
                    {entry.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          <MobileMenu />
        </Container>
      </div>
    </header>
  );
}
