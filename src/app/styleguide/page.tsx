import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import { Button, buttonClasses } from "@/components/Button";
import { Chip } from "@/components/Chip";
import { Container } from "@/components/Container";
import { Field } from "@/components/Field";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoonIcon,
  PauseIcon,
  PlayIcon,
  SearchIcon,
  SunIcon,
} from "@/components/icons";
import { LanguageBadge } from "@/components/PostLabels";
import { PostCard } from "@/components/PostCard";
import { PlaceholderImage } from "@/components/PlaceholderImage";
import type { ImageRatio } from "@/components/PlaceholderImage";
import { PostImage } from "@/components/PostImage";
import { SectionHeading } from "@/components/SectionHeading";
import { getLatestPosts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Styleguide",
  robots: { index: false, follow: false },
};

const colorTokens = [
  "background",
  "surface",
  "foreground",
  "muted",
  "border",
  "border-strong",
  "brand",
  "on-brand",
  "on-brand-muted",
  "brand-border",
  "accent",
  "on-accent",
  "link",
  "link-hover",
  "focus",
] as const;

const typeScale = [
  { name: "text-4xl", className: "text-4xl font-extrabold tracking-tight", note: "Page title, 48px from md" },
  { name: "text-3xl", className: "text-3xl font-extrabold tracking-tight", note: "Page title on phones, 36px" },
  { name: "text-2xl", className: "text-2xl font-bold tracking-tight", note: "Section heading, 30px" },
  { name: "text-xl", className: "text-xl font-bold tracking-tight", note: "Sub heading, 24px" },
  { name: "text-lg", className: "text-lg font-bold", note: "Card title, 20px" },
  { name: "text-base", className: "text-base", note: "Body, 17px, line height 1.6" },
  { name: "text-sm", className: "text-sm", note: "Meta and navigation, 15px" },
  { name: "text-xs", className: "text-xs", note: "Smallest text, 13px" },
] as const;

const spacing = [
  { step: "1", px: "4px", className: "w-1" },
  { step: "2", px: "8px", className: "w-2" },
  { step: "3", px: "12px", className: "w-3" },
  { step: "4", px: "16px", className: "w-4" },
  { step: "6", px: "24px", className: "w-6" },
  { step: "8", px: "32px", className: "w-8" },
  { step: "12", px: "48px", className: "w-12" },
  { step: "16", px: "64px", className: "w-16" },
] as const;

const imageRatios: readonly ImageRatio[] = ["16/9", "4/3", "3/2", "1/1"];

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-border py-10">
      <h2 id={id} className="mb-6">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ThemePanel({ theme }: { theme: "light" | "dark" }) {
  return (
    <div
      data-theme={theme}
      className="border border-border-strong bg-background p-4 text-foreground"
    >
      <h3 className="mb-4">{theme === "light" ? "Light theme" : "Dark theme"}</h3>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {colorTokens.map((token) => (
          <li key={token}>
            <div
              className="h-12 border border-border-strong"
              style={{ backgroundColor: `var(--${token})` }}
            />
            <p className="mt-1 text-xs font-semibold">{token}</p>
            <p className="text-xs text-muted">var(--{token})</p>
          </li>
        ))}
      </ul>

      <h4 className="mb-2 mt-6">Pairs in use</h4>
      <div className="grid gap-2 sm:grid-cols-2">
        <p className="border border-border bg-background p-3 text-foreground">Body text on page</p>
        <p className="border border-border bg-surface p-3 text-foreground">Body text on surface</p>
        <p className="border border-border bg-background p-3 text-muted">Muted text on page</p>
        <p className="border border-border bg-surface p-3 text-muted">Muted text on surface</p>
        <p className="bg-brand p-3 text-on-brand">Text on brand fill</p>
        <p className="bg-brand p-3 text-on-brand-muted">Muted text on brand fill</p>
        <p className="bg-accent p-3 font-semibold text-on-accent">Brown text on yellow fill</p>
        <p className="border border-border bg-background p-3">
          <a href="#colors" className="link">
            Link on page
          </a>
        </p>
      </div>
    </div>
  );
}

export default function StyleguidePage() {
  const samples = getLatestPosts(3);
  return (
    <Container className="py-section">
      <h1>Styleguide</h1>
      <p className="mt-3 max-w-prose text-muted">
        Source of truth for the Punto Publication design system. Every value on this
        page comes from the tokens in src/app/globals.css. This page is not indexed.
      </p>

      <nav aria-label="On this page" className="mt-6">
        <ul className="flex flex-wrap gap-x-6">
          {[
            ["colors", "Colors"],
            ["type", "Type scale"],
            ["spacing", "Spacing and layout"],
            ["buttons", "Buttons"],
            ["links", "Links"],
            ["forms", "Form focus states"],
            ["icons", "Icons"],
            ["images", "Images"],
            ["stories", "Story components"],
            ["header", "Header"],
            ["footer", "Footer"],
          ].map(([id, label]) => (
            <li key={id}>
              <a href={`#${id}`} className="link inline-flex min-h-11 items-center">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-6">
        <Section id="colors" title="Colors">
          <div className="grid gap-6 lg:grid-cols-2">
            <ThemePanel theme="light" />
            <ThemePanel theme="dark" />
          </div>
          <p className="mt-4 max-w-prose text-sm text-muted">
            Yellow is a fill with brown text on top. It is never used as text on a
            light background. Run npm run contrast for the WCAG AA table.
          </p>
        </Section>

        <Section id="type" title="Type scale">
          <p className="mb-6 max-w-prose text-muted">
            Plus Jakarta Sans only. Headings are weight 700 or 800 with tight tracking.
            No all caps and no letter spaced labels.
          </p>
          <ul className="divide-y divide-border border-y border-border">
            {typeScale.map((item) => (
              <li
                key={item.name}
                className="grid gap-1 py-4 md:grid-cols-[12rem_1fr] md:items-baseline md:gap-6"
              >
                <p className="text-sm text-muted">
                  {item.name}
                  <br />
                  {item.note}
                </p>
                <p className={item.className}>Punto Publication</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-prose">
            Article body text is at most 68 characters wide. This paragraph uses the
            max-w-prose token so you can check the measure on your device. Body copy is
            17px with a line height of 1.6.
          </p>
        </Section>

        <Section id="spacing" title="Spacing and layout">
          <ul className="grid gap-2">
            {spacing.map((item) => (
              <li key={item.step} className="flex items-center gap-4">
                <span className="w-24 text-sm text-muted">
                  {item.step} ({item.px})
                </span>
                <span className={`${item.className} h-4 bg-brand`} />
              </li>
            ))}
          </ul>
          <p className="mt-6 max-w-prose text-sm text-muted">
            Content width is 1200px. Page gutters are 16px on phones and 24px from 640px
            up. Section spacing is the py-section token (48px).
          </p>
        </Section>

        <Section id="buttons" title="Buttons">
          <div className="flex flex-wrap gap-3">
            <Button>Primary</Button>
            <Button variant="accent">Accent</Button>
            <Button variant="secondary">Secondary</Button>
            <Button disabled>Disabled</Button>
            <Link href="/styleguide" className={buttonClasses("secondary")}>
              Link styled as a button
            </Link>
          </div>
          <p className="mb-3 mt-6 max-w-prose text-sm text-muted">
            On a brand band (the Banner on the home page) the accent button is paired
            with the onBrand outline button.
          </p>
          <div className="flex flex-wrap gap-3 bg-brand p-4 [--focus:var(--accent)]">
            <Link href="/styleguide" className={buttonClasses("accent")}>
              Accent
            </Link>
            <Link href="/styleguide" className={buttonClasses("onBrand")}>
              onBrand
            </Link>
          </div>
        </Section>

        <Section id="links" title="Links">
          <p className="max-w-prose">
            Body text with an <a href="#links" className="link">inline link</a>. Links are
            always underlined, so color is never the only cue. Hover thickens the
            underline.
          </p>
          <p className="mt-3 max-w-prose">
            Navigation links use semibold weight with an underline on hover and on the
            current page.
          </p>
        </Section>

        <Section id="forms" title="Form focus states">
          <div className="grid max-w-xl gap-6">
            <Field
              id="sg-name"
              label="First name"
              hint="Tab into the field to see the focus ring."
              placeholder="Type here"
            />
            <div>
              <Field
                id="sg-forced"
                label="Focus ring, shown for reference"
                defaultValue="Always showing"
                className="outline-2 outline-offset-2 outline-focus"
              />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button className="outline-2 outline-offset-2 outline-focus">Focused button</Button>
              <Button variant="accent" className="outline-2 outline-offset-2 outline-focus">
                Focused accent
              </Button>
            </div>
          </div>
        </Section>

        <Section id="icons" title="Icons">
          <div className="flex items-center gap-4">
            <SearchIcon className="size-6" />
            <ChevronLeftIcon className="size-6" />
            <ChevronRightIcon className="size-6" />
            <PauseIcon className="size-6" />
            <PlayIcon className="size-6" />
            <MoonIcon className="size-6" />
            <SunIcon className="size-6" />
            <p className="text-sm text-muted">
              Inline SVG, 24px grid, one 1.75 stroke. Icons never carry meaning alone.
            </p>
          </div>
        </Section>

        <Section id="images" title="Images">
          <h3 className="mb-3">PlaceholderImage</h3>
          <p className="mb-4 max-w-prose text-muted">
            A flat block in brand colors that keeps the space of a missing picture. Four
            ratios. Hidden from screen readers.
          </p>
          <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {imageRatios.map((ratio) => (
              <li key={ratio}>
                <PlaceholderImage ratio={ratio} />
                <p className="mt-1 text-sm text-muted">{ratio}</p>
              </li>
            ))}
          </ul>

          <h3 className="mb-3 mt-10">PostImage</h3>
          <p className="mb-4 max-w-prose text-muted">
            Uses next/image when there is a src and PlaceholderImage when there is not. Both
            states take the same space. The sizes prop is required.
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:max-w-2xl">
            <li>
              <PostImage
                image={{ src: "/brand/logo.webp", alt: "Punto Publication seal" }}
                ratio="1/1"
                sizes="(min-width: 1024px) 336px, (min-width: 640px) 50vw, 100vw"
              />
              <p className="mt-1 text-sm text-muted">With a src (next/image)</p>
            </li>
            <li>
              <PostImage
                image={{ alt: "Not shown" }}
                ratio="1/1"
                sizes="(min-width: 1024px) 336px, (min-width: 640px) 50vw, 100vw"
              />
              <p className="mt-1 text-sm text-muted">No src (placeholder)</p>
            </li>
          </ul>
        </Section>

        <Section id="stories" title="Story components">
          {samples.length === 0 ? (
            <p className="text-muted">Add a post to see the story components.</p>
          ) : (
            <>
              <h3 className="mb-3">PostCard</h3>
              <p className="mb-6 max-w-prose text-muted">
                The whole card is one link. Three variants: large, standard and compact
                (with or without a thumbnail).
              </p>
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <p className="mb-2 text-sm font-semibold">large</p>
                  <PostCard post={samples[0]} variant="large" sizes="(min-width: 1024px) 560px, 100vw" />
                </div>
                <div>
                  <p className="mb-2 text-sm font-semibold">standard</p>
                  <PostCard post={samples[1] ?? samples[0]} variant="standard" sizes="(min-width: 1024px) 560px, 100vw" />
                  <p className="mb-2 mt-8 text-sm font-semibold">compact with thumbnail</p>
                  <PostCard post={samples[2] ?? samples[0]} variant="compact" />
                  <p className="mb-2 mt-8 text-sm font-semibold">compact, headline only</p>
                  <PostCard post={samples[2] ?? samples[0]} variant="compact" thumbnail={false} />
                </div>
              </div>
            </>
          )}

          <h3 className="mb-3 mt-10">SectionHeading</h3>
          <SectionHeading title="News" href="/section/news" linkLabel="See all News stories" />

          <h3 className="mb-3 mt-10">Chip and LanguageBadge</h3>
          <div className="flex flex-wrap items-center gap-3">
            <Chip href="/styleguide">Digos City</Chip>
            <LanguageBadge language="tl" />
          </div>
        </Section>

        <Section id="header" title="Header">
          <div className="border border-border-strong">
            <Header />
          </div>
        </Section>

        <Section id="footer" title="Footer">
          <div className="border border-border-strong">
            <Footer />
          </div>
        </Section>
      </div>
    </Container>
  );
}
