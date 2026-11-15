# Punto Publication Design System

Written from what is built in Phase 1. If this file and the code ever disagree, the code wins and this file gets updated. The visual source of truth is the `/styleguide` route (not indexed).

## Brand
Name: Punto Publication, Provincial Youth Journalist, Davao del Sur.
Audience: general public, English and Tagalog, phones first.
Feel: clean, modern, professional, sleek. Flat and newspaper like.
Logo: `public/brand/logo.webp` (transparent seal). Shown with the site name as text beside it.

## Rules that never change
1. Yellow is a fill with brown text on top. Never yellow text on a light background.
2. Never hardcode a color, font size or spacing value. Use the variables and Tailwind tokens below.
3. Plus Jakarta Sans only. No all caps text, no letter spaced labels.
4. 1px borders and thin rules. Radius 4px at most. No shadows. No gradients, glow, blur or glassmorphism.
5. No emoji in the UI. Icons are few, inline SVG, one 1.75 stroke.
6. No fake stats, testimonials, filler copy, or invented claims, awards, numbers or history.
7. WCAG AA in both themes (checked by `npm run contrast`).
8. Authors are minors: first names only in bylines, staff page, image credits, metadata, structured data and RSS. Staff photos are optional, default is an initials badge in brand colors.

## Tokens
Defined in `src/app/globals.css`. Light is the default. Dark applies when `data-theme="dark"` is on the html element. Any element can carry `data-theme` to scope a theme (the styleguide does this). Tailwind's default colors, radii, shadows and blur are removed, so only these exist.

| Tailwind class suffix | CSS variable | Light | Dark | Use |
| --- | --- | --- | --- | --- |
| `background` | `--background` | #fafafa | #1b0e06 | Page |
| `surface` | `--surface` | #f2ece6 | #2a170b | Utility bar, hover fills |
| `foreground` | `--foreground` | #2b1305 | #fafafa | Body text |
| `muted` | `--muted` | #6a5546 | #cbb6a4 | Secondary text |
| `border` | `--border` | #dcd0c5 | #4a2f1d | Thin rules |
| `border-strong` | `--border-strong` | #8c7566 | #8f7561 | Input and button borders |
| `brand` | `--brand` | #5f2805 | #5f2805 | Brand fill (footer, primary button) |
| `on-brand` | `--on-brand` | #fafafa | #fafafa | Text on brand |
| `on-brand-muted` | `--on-brand-muted` | #e6d5c6 | #e6d5c6 | Secondary text on brand |
| `brand-border` | `--brand-border` | #8a5a38 | #8a5a38 | Rules on brand |
| `accent` | `--accent` | #ffd939 | #ffd939 | Yellow fill only |
| `on-accent` | `--on-accent` | #5f2805 | #5f2805 | Brown text on yellow |
| `link` | `--link` | #5f2805 | #f0cfae | Links |
| `link-hover` | `--link-hover` | #3b1803 | #fafafa | Link hover |
| `focus` | `--focus` | #5f2805 | #ffd939 | Focus ring (the footer sets it to yellow) |

Use as `bg-surface`, `text-muted`, `border-border`, `bg-accent text-on-accent` and so on.

## Typography
Font: Plus Jakarta Sans through `next/font/google`, variable font, `display: swap`. Only weights 400 to 800 are used. Variable `--font-plus-jakarta-sans`, Tailwind `font-sans`.
Headings: weight 800 (h1) or 700, tracking `-0.02em`, tight line height. Plain `h1` to `h4` are styled in `globals.css`.
Body: 17px, line height 1.6. Article text is at most 68 characters wide (`max-w-prose`).

| Class | Size | Line height | Use |
| --- | --- | --- | --- |
| `text-4xl` | 48px | 1.1 | Page title from 768px (h1) |
| `text-3xl` | 36px | 1.15 | Page title on phones (h1) |
| `text-2xl` | 30px | 1.2 | Section heading (h2) |
| `text-xl` | 24px | 1.25 | Sub heading (h3) |
| `text-lg` | 20px | 1.4 | Card title (h4), mobile menu |
| `text-base` | 17px | 1.6 | Body |
| `text-sm` | 15px | 1.5 | Navigation, meta |
| `text-xs` | 13px | 1.5 | Smallest text |

## Spacing and layout
Spacing is Tailwind's scale on a 4px base: 1 (4px), 2, 3, 4 (16px), 6, 8, 12, 16 (64px). Tap targets are `min-h-11` (44px) or larger.
Named tokens: `gutter` (16px, 24px from 640px), `section` (48px, use `py-section`), `utility` (44px utility bar), `header` (64px main bar).
Content width is 1200px, set by `--content-width`. Use `Container` or `.container-page`.
The home page uses two columns from 1024px: `lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]`, for the hero and the headlines, and again for the section blocks and the Facebook feed.
Radius: `rounded-sm` (2px) and `rounded-md` (4px) only. No shadow tokens exist.
Header breakpoint: full navigation from 1024px, menu button below. The header lists the six sections only. Municipalities are not in the header.

## Contrast (WCAG AA)
Ratios from `npm run contrast`, which reads the two theme blocks in `globals.css` and exits with an error if any pair fails.

| Pair | Light | Dark | Needs |
| --- | --- | --- | --- |
| Body text on page | 16.79 | 18.09 | 4.5 |
| Body text on surface | 14.95 | 16.41 | 4.5 |
| Muted text on page | 6.70 | 9.68 | 4.5 |
| Muted text on surface | 5.97 | 8.78 | 4.5 |
| Link on page | 11.23 | 12.81 | 4.5 |
| Link on surface | 10.00 | 11.62 | 4.5 |
| Link hover on page | 15.27 | 18.09 | 4.5 |
| Text on brand fill | 11.23 | 11.23 | 4.5 |
| Muted text on brand fill | 8.20 | 8.20 | 4.5 |
| Brown text on yellow fill | 8.50 | 8.50 | 4.5 |
| Focus ring on page | 11.23 | 13.70 | 3 |
| Focus ring on surface | 10.00 | 12.43 | 3 |
| Input border on page | 4.15 | 4.39 | 3 |
| Yellow focus ring on brand (footer) | 8.50 | 8.50 | 3 |

## Site config
`src/config/site.ts` holds the site name, `tagline` (empty, hidden while empty), sections, municipalities, main nav (the sections), policy links, `socialLinks` and `contactEmail` (both hidden while empty). Header and footer read only from here. Slugs come from `slugify` in `src/lib/slug.ts`.
Sections: News, Features, Editorial, Opinion, Sports, Literary. Municipalities (used as categories): Digos City, Bansalan, Hagonoy, Kiblawan, Magsaysay, Malalag, Matanao, Padada, Santa Cruz, Sulop.
Routes built: `/` only (and the unindexed `/styleguide`).
Routes linked, not built yet: `/article/[slug]`, `/section/[slug]`, `/municipality/[slug]`, `/municipality`, `/archive`, `/gallery/[slug]`, `/search`, and the policy pages `/editorial-policy`, `/corrections`, `/ethics`, `/privacy`, `/terms`.

## Environment variables
Listed in `.env.example`. Both are optional.
- `NEXT_PUBLIC_SITE_URL`: the public address, for example `https://puntopublication.example`. Used for metadata and the `WebSite` structured data. Falls back to the Vercel production address, then to `http://localhost:3000` in development only. When none is known in a production build, the structured data leaves out its `url`.
- `NEXT_PUBLIC_FB_PAGE_URL`: the Facebook page address (https, a facebook.com host). Empty or invalid hides the home page feed column completely.

Helpers: `src/lib/site-url.ts` (`getSiteUrl`, `getMetadataBase`, `absoluteUrl`) and `src/lib/format.ts` (`formatDate` in Asia/Manila time, `formatReadingTime`).

## Theme
One toggle button switches between light and dark. The first visit follows the device setting. After the first press the choice is saved in `localStorage` key `punto-theme`. `themeScript` in `src/lib/theme.ts` runs inline in the head before first paint and sets `data-theme` on the html element. It also follows the device setting (until a choice is saved) and other tabs.

## Components
All in `src/components`. Server components unless marked client.

| Component | Props | Use |
| --- | --- | --- |
| `Container` | div props | Page width and gutters. Wrap page content. |
| `Header` | none | Utility bar (date, theme toggle, search) and sticky main bar with the sections. In the layout. |
| `Footer` | none | Brand colored footer from config. In the layout. |
| `Logo` | `variant` header or footer, `onNavigate`, `className` | Seal plus site name, links home. |
| `SkipLink` | none | First focusable element. Targets `#main-content`. |
| `Button` | `variant` primary, accent or secondary, button props | Buttons. |
| `buttonClasses` | `variant`, `className` | Button look for links: `<Link className={buttonClasses("secondary")}>`. |
| `Field` | `id`, `label`, `hint`, input props | Labelled text input. `controlClasses` styles other controls. |
| `NavLink` (client) | `href`, `exact`, Link props | Link that sets `aria-current="page"`. |
| `MobileMenu` (client) | none | Menu button and full screen sheet with the sections and search, on a native modal dialog (focus trap, Escape, scroll lock). |
| `ThemeToggle` (client) | none | Single button, light or dark. Uses `aria-pressed` (pressed means dark) and a status region announces changes. |
| `TodayDate` (client) | none | Today in Asia/Manila, filled in on the device so the static page never shows a stale date. |
| `CurrentYear` (client) | none | Year for the copyright line. |
| `icons` | `className` | `SearchIcon`, `MenuIcon`, `CloseIcon`, `MoonIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `PauseIcon`, `PlayIcon`. |
| `PlaceholderImage` | `ratio` 16/9, 4/3, 3/2 or 1/1, `className` | Flat brand colored block with a small "Placeholder" label. Hidden from screen readers. Takes the same space as a real image. |
| `PostImage` | `post` or `image`, `sizes` (required), `ratio`, `priority`, `className` | Cover or gallery image. Real `src` goes through `next/image` with `fill`, so there is no layout shift. No `src` shows `PlaceholderImage`. `priority` is for the first image on a page (eager, high fetch priority). |
| `Markdown` | `children` (the Markdown text), `className` | Renders a post body. Headings move down one level (`#` becomes h2). Images go through `PostImage`. Raw HTML is never rendered. At most 68 characters wide. |
| `PostCard` | `post`, `variant` large, standard or compact, `headingLevel` h2, h3 or h4 (default h3), `priority`, `hero`, `thumbnail`, `clamp`, `sizes`, `className` | A story as one link target (the headline link is stretched over the card; labels are plain text). **large**: 16/9 image, labels, headline, excerpt, byline, date. **standard**: 3/2 image, labels, headline, byline, date. **compact**: 96px square thumbnail beside the headline, or headline only with `thumbnail={false}`; date only, no byline. Each shows the section label, the municipality label and a Tagalog badge only for Tagalog posts. `hero` makes the large headline bigger from 768px. `clamp` cuts headline and excerpt to 3 lines. `priority` only for the first image on a page. One focus ring is drawn around the whole card. |
| `PostLabels` | `post`, `className` | Section label, municipality label and `LanguageBadge`. Plain text, because the whole card is the link. |
| `LanguageBadge` | `language` | Yellow fill, brown text, "Tagalog". Renders nothing for English. |
| `PostDate` | `iso`, `className` | A `time` element with the date in Asia/Manila, for example "November 13, 2026". |
| `SectionHeading` | `title`, `href`, `linkLabel`, `as` h2 or h3, `id` | Heading with a 1px brown rule under it and an optional "See all" link (44px tap target). |
| `Chip` | Link props | Flat text link with a 1px border and a 44px tap target. Tags and municipalities. |
| `FeaturedSlider` (client) | `children` (one element per slide, rendered on the server), `label` | Carousel for 2 to 5 stories. Slides share one grid cell, so the tallest sets the height before JavaScript runs. CSS fade. Previous, next, dots, swipe, Left and Right arrow keys, pause and play. Autoplay is 7 seconds, only when reduced motion is not requested, and stops on hover, on focus and on pause. The pause button is hidden by CSS under reduced motion. The live region is polite when the reader moves the slide and off while it rotates itself. Never used for a single story. |
| `BreakingStrip` | none | Yellow bar with brown text, "Breaking" and the headline of the newest breaking post. Renders nothing without one. Sets `--focus` to brown inside, so the ring shows in dark theme. |
| `SectionBlock` | `slug` | Home page block: `SectionHeading`, one large card and three compact cards. Renders nothing for a section with no posts. |
| `MunicipalityStrip` | none | Chips for every municipality plus "All municipalities". |
| `GalleryHighlight` | none | Most recent gallery: four square images, title, date, link to `/gallery/[slug]`. Renders nothing without galleries. |
| `FacebookFeed` | none | Official Page Plugin as a lazy iframe (300 by 600), no Facebook script, plus a text link to the page. Reads `NEXT_PUBLIC_FB_PAGE_URL`. Renders nothing when it is empty or not a facebook.com address. `getFacebookPageUrl()` tells a page whether the column exists. |

New reusable components and tokens get added here and to `/styleguide`. The styleguide shows `PlaceholderImage` in all four ratios, `PostImage` with and without a `src`, the three `PostCard` variants, `SectionHeading`, `Chip` and `LanguageBadge`.

## Content model
Files in `content/`, loaded by `src/lib/content` (server only). Full how-to steps are in `CONTENT.md`.
- Posts: `content/posts/<slug>.md`, frontmatter plus Markdown body. Fields: `title`, `slug` (same as the file name), `excerpt`, `publishedAt`, `updatedAt`, `section`, `municipality` (both are slugs from `src/config/site.ts`), `tags`, `authors` (staff ids), `language` (`en` or `tl`), `coverImage`, `coverAlt` (required with `coverImage`), `coverCredit`, `featured`, `breaking`, `draft`, `correction`.
- Staff: `content/staff.json`. Fields: `id`, `firstName` (no space, comma or period), `position`, `municipality`, `bio`, `photo`. No last name field.
- Galleries: `content/galleries/<slug>.json`. Fields: `title`, `slug`, `date`, `municipality`, `description`, `images` (`src` optional, `alt`, `caption`, `credit` optional). An empty `src` renders a placeholder.
- Rules and types: `src/lib/content/schema.ts` (zod, every object is strict). Slug helpers (`tagSlug`, `sectionSlugs`, `getSectionBySlug`, and so on): `src/lib/content/slugs.ts`. Byline: `getByline(post)`, first names only.
- Loaders: `getAllPosts`, `getPostBySlug`, `getPostsBySection`, `getPostsByMunicipality`, `getPostsByTag`, `getAllTags`, `getFeaturedPosts`, `getBreakingPost`, `getLatestPosts`, `getRelatedPosts`, `getAdjacentPosts`, `getPostsGroupedByMonth`, `getAllStaff`, `getAuthors`, `getByline`, `getAllGalleries`, `getGalleryBySlug`. Posts are newest first and carry `readingTime` (minutes, 200 words per minute) and `wordCount`. Content is read once per build. Drafts show in dev and are removed from production builds.
- Dates are written in quotes, as `"2026-08-03"` or `"2026-08-03T09:00:00+08:00"`.

## Scripts
`npm run lint`, `npm run typecheck`, `npm run build`, `npm run contrast`, `npm run content:check`. The build runs `content:check` first and stops if any content file breaks a rule.
