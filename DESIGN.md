# Punto Publication Design System

Written from what is built in Phase 1. If this file and the code ever disagree, the code wins and this file gets updated. The visual source of truth is the `/styleguide` route (not indexed).

The sections "Design skills", "Interaction and motion", "Design principles" and "Before a page is done" are the standard for new work, written from the ui-ux-pro-max, impeccable, emil-design-eng and apple-design skills. The home page, the header, the mobile menu and the shared controls (`Button`, `Chip`) follow them. When new work follows them, this file and the code must agree.

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
8. Author names: our journalists are adults, so the site shows full names (`firstName` and `lastName`) in bylines, staff page, image credits, metadata, structured data and RSS. Staff photos are optional, default is an initials badge in brand colors.

## Design skills
Order of authority: `CLAUDE.md`, then "Rules that never change", then this file, then the skills. A skill adds craft. It never overrides a rule. When a skill and a rule disagree, the rule wins and the case goes in the second table.

| Skill | It decides | How it is used here |
| --- | --- | --- |
| `impeccable` | Surface mode, hierarchy, layout and the craft floor | Before editing UI, load the skill and read its `reference/craft-floor.md`. After editing, run `impeccable detect --json <changed files>` and fix what it finds, unless a finding contradicts a rule above (then leave it and say so). Modes: Read for stories and listings (the default on this site), Operate for the header, mobile menu, search, theme toggle and forms, Persuade only for the home `Banner`, Experience for gallery pages. There is no `PRODUCT.md` yet. `/impeccable init` can write one. |
| `ui-ux-pro-max` | What to check, in priority order: accessibility, touch, performance, style, layout, type and color, motion, forms, navigation | Its rules are the checklist in "Before a page is done". Its `--design-system` generator is not used because the palette and font are fixed. |
| `emil-design-eng` | Whether and how a detail moves: frequency, purpose, easing, speed, press feedback, origin | See "Interaction and motion". |
| `apple-design` | Response, interruptibility, spatial consistency, type tracking, reduced motion and the eight principles | See "Interaction and motion", "Typography" and "Design principles". |

Advice from the skills that is not used, and what is done instead:

| Skill advice | Rule it breaks | Instead |
| --- | --- | --- |
| Translucent materials, `backdrop-filter`, blurred sticky bars, scroll edge blur | 4 | Solid fills. A 1px `border-border` rule where the header meets the content. |
| Blur (`filter: blur`) to hide a rough crossfade | 4 | A plain opacity crossfade, shorter or with a better curve. |
| Gradient masks at scroll edges | 4 | The 1px rule. |
| Shadows for depth, bigger shadows on bigger surfaces | 4 | Hierarchy from size, weight, spacing, `surface` fill and 1px borders. |
| System font first, positive tracking on small text | 3 | Plus Jakarta Sans only. Tracking `-0.02em` on headings and `0` elsewhere. |
| Spring libraries (Motion) for drag and flick | `CLAUDE.md`: ask before adding a dependency | Asked and approved (2026-11-16): `motion` and `lenis` are dependencies. Springs only settle a drag back to rest, stiff and well damped, no bounce. Everything else stays CSS. |
| Bounce, confetti, delight effects, scroll reveals, stagger, parallax | 6 and plain reading | Not used. Content is readable at once. |
| Haptics and sound | not needed on a reading site | Not used. |

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
| `scrim` | `--scrim` | #1b0e06 | #1b0e06 | Flat tint over a photo that has text on it (the home banner). `Banner` draws it as a div with `bg-(--scrim) opacity-(--scrim-opacity)` (0.66, a layout token on `:root`) |
| `link` | `--link` | #5f2805 | #f0cfae | Links |
| `link-hover` | `--link-hover` | #3b1803 | #fafafa | Link hover |
| `focus` | `--focus` | #5f2805 | #ffd939 | Focus ring (the footer sets it to yellow) |

Use as `bg-surface`, `text-muted`, `border-border`, `bg-accent text-on-accent` and so on.

## Typography
Font: Plus Jakarta Sans through `next/font/google`, variable font, `display: swap`. Only weights 400 to 800 are used. Variable `--font-plus-jakarta-sans`, Tailwind `font-sans`.
Headings: weight 800 (h1) or 700, tracking `-0.02em`, tight line height. Plain `h1` to `h4` are styled in `globals.css`.
Body: 17px, line height 1.6. Story text on the article page is 18px with line height 1.65 (`text-article`) in a column of `max-w-article` (42rem, about 65 to 67 letters per line). `max-w-prose` is 68ch, and `ch` is the width of a zero, which is wide in Plus Jakarta Sans, so `max-w-prose` gives about 85 letters per line. Use `max-w-article` where the line must really be at most 68 characters.
Tracking and leading follow size: `-0.02em` and tight leading on large text, `0` and looser leading on body text. Never one fixed `letter-spacing` for every size, and no positive tracking on small text (rule 3). Hierarchy is weight, size and leading together, not size alone. Sizes and spacing are in `rem`, so they follow the reader's text size setting. New text containers use `min-h-` and never a fixed height, so larger text can wrap without being cut.

| Class | Size | Line height | Use |
| --- | --- | --- | --- |
| `text-4xl` | 48px | 1.1 | Page title from 768px (h1) |
| `text-3xl` | 36px | 1.15 | Page title on phones (h1) |
| `text-2xl` | 30px | 1.2 | Section heading (h2) |
| `text-xl` | 24px | 1.25 | Sub heading (h3) |
| `text-lg` | 20px | 1.4 | Card title (h4), mobile menu |
| `text-article` | 18px | 1.65 | Story body on the article page only |
| `text-base` | 17px | 1.6 | Body |
| `text-sm` | 15px | 1.5 | Navigation, meta |
| `text-xs` | 13px | 1.5 | Smallest text |

## Spacing and layout
Spacing is Tailwind's scale on a 4px base: 1 (4px), 2, 3, 4 (16px), 6, 8, 12, 16 (64px). Tap targets are `min-h-11` (44px) or larger.
Named tokens: `gutter` (16px, 24px from 640px), `section` (48px, use `py-section`), `utility` (44px utility bar), `header` (64px main bar).
Content width is 1200px, set by `--content-width`. Use `Container` or `.container-page`.
The home page uses two columns from 1024px: `lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]`, for the featured slider beside "Latest headlines", "Find a story" and the topics, and again for the municipality and gallery blocks beside the Facebook feed. "Meet the young journalists" follows, full width.
Radius: `rounded-sm` (2px) and `rounded-md` (4px) only. No shadow tokens exist.
Inner pages: every page that is not the home page or a story starts with `PageHeader` (title, one paragraph, a full width photo band) and then uses the whole 1200px grid. Split rows (text beside a photo) and a full width brand band are the layout tools. Not a narrow column with an empty right side. Photos are placeholders until real ones are set in `src/config/page-images.ts`. Text goes on a photo only over the scrim (the home `Banner`). The `PageHeader` band has no text on it.
Header breakpoint: full navigation and the two call to action buttons from 1024px, menu button below. The header links are About, Gallery and Archive (`mainNav` in `src/config/site.ts`). The six sections are not header links: they are the filter on `/archive` (`/archive?section=news`), and the footer lists them.

## Interaction and motion
Status: built in `globals.css` and used on the home page, the header and the mobile menu. New components use the same tokens, utility and classes.

This is a reading site. Most things do not move. Decide in this order: does it need to move (how often is it seen), what is the purpose, which curve, how long.

| Thing | Motion |
| --- | --- |
| Keyboard actions, links, navigation, search typing | None |
| Hover and focus | Color or underline change only, 150ms, and only inside `@media (hover: hover) and (pointer: fine)` |
| Press on `Button`, `Chip`, icon buttons | `scale(0.97)` on `:active`, 120ms, starts on press and not on release |
| Mobile menu sheet, popovers, dialogs | 200ms, from opacity 0 and a small move or `scale(0.95)` |
| Scrolling | Lenis smooth scroll on the whole site. Off under reduced motion |
| Slider | Incoming slide fades in over 300ms, outgoing fades out over 200ms (Motion). A touch swipe moves the slide 1:1 and a spring settles it |
| Page transitions, scroll reveals, parallax, stagger, looping decoration | Never |

Tokens (in `globals.css`): `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` and `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` in `@theme` (classes `ease-out` and `ease-in-out`; Tailwind's `ease-in` and `ease-linear` are removed), and on `:root` `--duration-press` 120ms, `--duration-fast` 150ms, `--duration-base` 200ms, `--duration-exit` 130ms (about two thirds of base, for exits) and `--duration-slow` 300ms. Use durations as `duration-(--duration-fast)`. Nothing is longer than `--duration-slow`.

Libraries (approved 2026-11-16, the only two animation dependencies):
- `lenis` runs smooth scrolling for the whole site through `SmoothScroll` in the layout (`lerp` 0.1, `autoRaf`). It is destroyed under `prefers-reduced-motion: reduce` and follows that setting live. Its CSS is imported at the top of `globals.css`. Keyboard scrolling, find in page and focus scrolling stay native. In page links (`href="#id"`) are caught and glide to the target 80px below the top (the sticky bar plus 1rem, same as `scroll-padding-top`), then the target gets focus. Anything that must scroll by itself carries `data-lenis-prevent` (the mobile menu dialog does). Add it to any new scrollable box, dialog or sheet.
- `motion` is used through `LazyMotion` with `domAnimation` and `strict`, importing `m` from `motion/react-m`, so the loaded code stays small. Never import `motion` from `motion/react` for components: use `m`. Wrap in `MotionConfig reducedMotion="user"`. Use the same curve as `--ease-out` (`[0.23, 1, 0.32, 1]`) and the same lengths as the duration tokens. Springs only for settling a drag: `stiffness` 420, `damping` 42. Today only `FeaturedSlider` uses it. The CSS parts (press, hover, `.sheet`) stay CSS.
- The "Never" rows above still hold: no page transitions, scroll reveals, parallax or stagger, with or without these libraries.

What is built on them:
- `hover:` is redefined in `globals.css` with `@custom-variant` so it only applies inside `@media (hover: hover) and (pointer: fine)`. Every `hover:` and `group-hover:` class follows it, so a tap on a phone never leaves a stuck hover state. Plain CSS hover rules (such as `.link:hover`) sit inside the same media query.
- `press` utility: `scale(0.97)` on `:active` (not when disabled) over `--duration-press`, and color, background and border changes over `--duration-fast`. On `Button`, `buttonClasses`, `Chip`, the theme toggle, the search icon, the menu and close buttons and the slider controls. Never on cards or headline links.
- `.sheet` class: a native dialog that fades in with an 8px move down over `--duration-base` and leaves the same way over `--duration-exit`. Uses `@starting-style` and `allow-discrete` transitions of `display` and `overlay`, so it can reverse midway. Used by `MobileMenu`.
- `.link` changes color over `--duration-fast`.
- `touch-action: manipulation` is set in the base layer on links, buttons, `summary`, labels, inputs and `[role="button"]`.
- The base layer also themes the browser's own parts: `scrollbar-color`, `accent-color` and `caret-color` from the palette.

Rules:
1. Respond on press, not on release. Feedback appears within 100ms. Large cards and headline links do not scale, because the text would shift.
2. Animate `transform`, `opacity` and color only. Never `transition: all`: name the properties. Never animate width, height, margin or top, so there is no layout shift.
3. Use `ease-out` for things entering and leaving. Never `ease-in` on UI. `linear` only for constant motion.
4. Nothing grows from `scale(0)`. Start at `scale(0.95)` or more with `opacity: 0`.
5. Exits are shorter than entrances, about two thirds.
6. Use CSS transitions, not keyframes, for anything that can be toggled quickly, so it can be interrupted and reverse from where it is. Never lock input during a transition. Slider buttons and Escape work at any moment.
7. Enter and leave along the same path. A sheet that slides in from the right leaves to the right. A popover scales from its trigger (`transform-origin` at the trigger). A modal stays centered.
8. Autoplay exists only in the featured slider. It needs a pause button, stops on hover and focus, and is off under reduced motion (all built).
9. Reduced motion: the global rule in `globals.css` makes every transition and animation instant. That is the fallback for all new motion. Do not fight it with `!important`.
10. Taps: `touch-action: manipulation` on controls. Targets are at least 44px with at least 8px between them. Grow the hit area with padding, not the visible shape. Nothing depends on hover alone.
11. A gesture is never the only way. If a swipe or drag is added: Pointer Events with capture, 1:1 tracking from where it was grabbed, about 10px before the direction is chosen, resistance at the edges instead of a hard stop, and a visible button for the same action. The featured slider does this for touch and pen; it wraps around, so it has no edges to resist at.
12. Check motion at 3 times slower, frame by frame, and on a real phone, with reduced motion on and off.

## Design principles
From the apple-design skill, applied to a news site.
- Purpose: each page has one job and one main action. In a `Banner` the accent button comes first. Do not add a feature because it is possible.
- Familiarity: use news conventions (section navigation, byline and date, breadcrumbs on stories, older and newer links). The same thing looks and behaves the same everywhere, and sits in the same place. Break a convention only with a reason that has been tested.
- Simplicity, not minimalism: show the common path first. The header shows its four links and two buttons in the bar on desktop and does not hide them in a menu. The sections are one filter on the archive, not six pages.
- Wayfinding: every page answers where am I (`aria-current`, h1, breadcrumb), where can I go (header, related stories, older and newer) and how do I get out (logo to home, skip link, Escape closes the menu). Never trap the reader.
- Grouping and mapping: put a control next to what it affects. The share row is under the story, the correction note is above the cover.
- Specific labels: "Older story", "Share this story". A link makes sense read alone. Never "click here" or a bare "Read more".
- Feedback: status, completion, warning, error. "Copied" after copying a link (built). Validate a field on blur, put the error under the field, say the cause and the fix, announce it with `aria-live`.
- Agency: the reader can pause motion, change the theme (remembered) and always leave. No pop-ups that cover the story.
- Responsibility: rule 8 (author names) is this principle. Do not add third party scripts without asking. The Facebook feed is a plain iframe for that reason.
- Craft: every value is a token. Icons share one stroke and align to the text. Check both themes and a 375px phone before saying done.
- Delight comes from getting the rest right: a calm, trustworthy feel. No effects added for show.

## Before a page is done
Checklist from ui-ux-pro-max, in its priority order. Run `npm run lint`, `npm run typecheck`, `npm run build`, `npm run contrast` and `npm run content:check` as well, and the `impeccable detect` step from "Design skills".
1. Accessibility: contrast passes in both themes. A visible focus ring on every control, never removed. One h1 and headings in order. The skip link is first. Meaningful images have alt text and decorative ones have empty alt. Icon-only buttons have `aria-label`. Meaning is never by color alone (links are underlined, the Tagalog badge says "Tagalog"). Tagalog text carries `lang="tl"`. Tab order matches the visual order.
2. Touch: targets 44px or more, 8px or more apart, press feedback within 100ms, nothing hover only.
3. Performance: `next/image` with `sizes`, space reserved so nothing jumps (layout shift under 0.1), `priority` only on the first image, `display: swap` for the font, no new third party script.
4. Style: only tokens, flat, one icon set and stroke, one main action per screen, the same pattern looks the same.
5. Layout: phone first, checked at 375px and in landscape. No horizontal scroll. Zoom is never disabled. Use `svh`, not `100vh`. Story lines at most 68 characters. Text at 200% still works.
6. Type and color: body 16px or more, sizes from the scale, tracking by size, semantic tokens and never raw hex. Dark theme values are set on their own, not inverted.
7. Motion: follows "Interaction and motion", checked with reduced motion on.
8. Forms: a visible label (`Field`), never placeholder only. Error under the field with cause and fix. The right input type and `autocomplete`. Inputs 44px or more tall.
9. Navigation: the current page has `aria-current`. The same navigation on every page. Every page has its own URL. Search is easy to reach.

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
| Text on the photo scrim (worst case, a white photo) | 5.87 | 5.87 | 4.5 |
| Outline button border on the photo scrim | 4.29 | 4.29 | 3 |
| Yellow focus ring on the photo scrim | 4.45 | 4.45 | 3 |

## Site config
`src/config/site.ts` holds the site name, `motto` ("In Truth, We Serve. In Words, We Lead.", the home banner heading), `tagline` ("Empowering the Voice of the Youth through Responsible Journalism.", the banner paragraph and the footer line, hidden if emptied), `siteDescription` (tagline plus the brand line, used for metadata), sections, municipalities, main nav (About, Gallery, Archive), policy links, `socialLinks` and `contactEmail` (both hidden while empty). Header and footer read only from here. `sections[].href` is `/archive?section=<slug>`. Slugs come from `slugify` in `src/lib/slug.ts`.
Sections: News, Features, Editorial, Opinion, Sports, Literary. Municipalities (used as categories): Digos City, Bansalan, Hagonoy, Kiblawan, Magsaysay, Malalag, Matanao, Padada, Santa Cruz, Sulop.
Routes built: `/`, `/article/[slug]`, `/archive` and `/about` (and the unindexed `/styleguide`).
There are no `/section/[slug]` pages: the sections are the filter on `/archive` (`?section=<slug>`).
Routes linked, not built yet: `/tag/[slug]`, `/gallery`, `/gallery/[slug]`, `/search`, and the policy pages `/editorial-policy`, `/corrections`, `/ethics`, `/privacy`, `/terms`.

## Environment variables
Listed in `.env.example`. Both are optional.
- `NEXT_PUBLIC_SITE_URL`: the public address, for example `https://puntopublication.example`. Used for metadata, the `WebSite`, `NewsArticle` and `BreadcrumbList` structured data and the Facebook and X share links on stories. Falls back to the Vercel production address, then to `http://localhost:3000` in development only. When none is known in a production build, the structured data leaves out its `url`.
- `NEXT_PUBLIC_FB_PAGE_URL`: the Facebook page address (https, a facebook.com host). Empty or invalid hides the home page feed column completely.

Helpers: `src/lib/site-url.ts` (`getSiteUrl`, `getMetadataBase`, `absoluteUrl`) `src/lib/format.ts` (`formatDate` in Asia/Manila time, `formatReadingTime`) and `src/lib/article-seo.ts` (`articlePath`, `articleMetadata`, `articleJsonLd`, `breadcrumbJsonLd`, `jsonLdScript`).

## Theme
One toggle button switches between light and dark. The first visit follows the device setting. After the first press the choice is saved in `localStorage` key `punto-theme`. `themeScript` in `src/lib/theme.ts` runs inline in the head before first paint and sets `data-theme` on the html element. It also follows the device setting (until a choice is saved) and other tabs.

## Components
All in `src/components`. Server components unless marked client.

| Component | Props | Use |
| --- | --- | --- |
| `Container` | div props | Page width and gutters. Wrap page content. |
| `Header` | none | Utility bar (date, theme toggle, search) and sticky main bar with the logo, the links (About, Gallery, Archive) and the two call to action buttons (`HeaderActions`). In the layout. |
| `ArchiveBrowser` (client) | `items` (`ArchiveItem[]`: slug, section, municipality, month, and a `PostCard` rendered on the server), `sections`, `municipalities`, `pageSize` (default 20) | The list on `/archive`. From 1024px the filters are a sticky 16rem column on the left (the section chips stacked) and the list fills the rest. Compact `PostCard` rows grouped by month (`SectionHeading` per month), newest first. Section chips (`aria-pressed`, the selected one is filled with the foreground color and has background colored text) and a labelled municipality select filter it. The filter lives in the address (`?section=news&municipality=hagonoy`) and is read in the browser, so the page stays static and a filtered view can be shared. Without JavaScript, and before it loads, every story is listed. After that the newest `pageSize` show and "Show more stories" adds more. A `role="status"` line says how many stories show, and an empty result offers "Show all stories". |
| `HeaderActions` | `className` | The header's two call to action buttons: "Send a tip" (accent, a message to the Facebook page, or `mailto:` when only `contactEmail` is set) and "Follow on Facebook" (secondary). Both open in a new tab. A button with no address is left out, and nothing renders when neither exists. In the main bar from 1024px, and under the links in the mobile menu as full width buttons. |
| `Footer` | none | Brand colored footer from config. In the layout. |
| `Logo` | `variant` header or footer, `onNavigate`, `className` | Seal plus site name, links home. |
| `SkipLink` | none | First focusable element. Targets `#main-content`. |
| `Button` | `variant` primary, accent, secondary or onBrand, button props | Buttons. `onBrand` is an outline button with light text, for brand colored bands next to an accent button. Has `press` feedback. |
| `Banner` | `title` (the h1), `children` (one paragraph), `actions` (one or two buttons or links), `above`, `fullScreen`, `image`, `className` | The standard banner: a flat brand colored band with the page h1, a paragraph (`max-w-article`, at most 68 characters wide) and calls to action. Use once, at the top of a page, with `buttonClasses("accent")` first and `buttonClasses("onBrand")` second. Sets the focus ring to yellow inside. `above` is a slot for the breaking strip. `fullScreen` makes `above` and the band together as tall as the viewport below the header (`100svh` minus `--utility-height` and `--header-height`), centers the text and uses `text-4xl` for the h1. On the home page it is full screen, shows the motto as the h1 (one sentence per line) and the tagline as the paragraph, with the breaking strip in `above`. With `image` (the home page passes `pageImages.home.banner`, the Capitol photo) the photo is the background of the whole banner, with a flat scrim (the `scrim` color at 66%, no gradient, no blur) between it and the text, so the text has the same contrast on every part of the photo. The paragraph is full `on-brand` color on the photo, not muted. `npm run contrast` checks the text against the worst case, a white photo under the scrim. The photo has alt text and loads at once (`priority`). An empty `src` gives the plain band. The featured slider follows it as the second section (`#top-stories`), with "Latest headlines" (the four newest stories not in the slider, as compact cards without thumbnails, then a "See all published stories" text link to `/archive`), `SearchBlock` and `TopicStrip` beside it. |
| `buttonClasses` | `variant`, `className` | Button look for links: `<Link className={buttonClasses("secondary")}>`. |
| `Field` | `id`, `label`, `hint`, input props | Labelled text input. `controlClasses` styles other controls. |
| `NavLink` (client) | `href`, `exact`, Link props | Link that sets `aria-current="page"`. |
| `MobileMenu` (client) | `children` (the call to action buttons) | Menu button and full screen sheet with the header links, search and the buttons, on a native modal dialog (focus trap, Escape, scroll lock). The sheet fades in and out with the `.sheet` class. |
| `ThemeToggle` (client) | none | Single button, light or dark. Shows a moon in light theme (press for dark) and a sun in dark theme (press for light). The icon is switched by CSS from `data-theme`, so the first paint is right. Uses `aria-pressed` (pressed means dark) and a status region announces changes. |
| `TodayDate` (client) | none | Today in Asia/Manila, filled in on the device so the static page never shows a stale date. |
| `CurrentYear` (client) | none | Year for the copyright line. |
| `icons` | `className` | `SearchIcon`, `MenuIcon`, `CloseIcon`, `MoonIcon`, `SunIcon`, `ChevronLeftIcon`, `ChevronRightIcon`, `PauseIcon`, `PlayIcon`. |
| `PlaceholderImage` | `ratio` 16/9, 4/3, 3/2, 1/1 or band, `className` | Flat brand colored block with a small "Placeholder" label. Hidden from screen readers. Takes the same space as a real image. `band` is a full width strip with a fixed height (14rem, 18rem from 640px, 24rem from 1024px), for the photo under a page title. |
| `PostImage` | `post` or `image`, `sizes` (required), `ratio`, `priority`, `className` | Cover or gallery image. Real `src` goes through `next/image` with `fill`, so there is no layout shift. No `src` shows `PlaceholderImage`. `priority` is for the first image on a page (eager, high fetch priority). |
| `PagePhoto` | `image` (a slot from `pageImages`), `sizes` (required), `ratio` (default 3/2, or `band`), `priority`, `className`, `captionClassName` | A photo for a page slot, as a `figure`. No `src` shows the placeholder, which takes the same space. With a `src` the alt text is required, which fails the build if missing. Shows "Photo: Ana Reyes" under the photo when there is a credit. Slots live in `src/config/page-images.ts`, with the steps for adding a real photo. |
| `PageHeader` | `title` (the h1), `children` (one short paragraph), `image` (a slot from `pageImages`) | The top of every page that is not the home page or a story: the h1 on the left and one paragraph on the right from 1024px (stacked on phones), then a `PagePhoto` band across the full screen width. Place it before the page's `Container`, not inside it. Used by `/about` and `/archive`. |
| `Markdown` | `children` (the Markdown text), `className` | Renders a post body. Headings move down one level (`#` becomes h2). Images go through `PostImage`. Raw HTML is never rendered. At most 68 characters wide. |
| `PostCard` | `post`, `variant` large, standard or compact, `headingLevel` h2, h3 or h4 (default h3), `priority`, `hero`, `thumbnail`, `clamp`, `sizes`, `className` | A story as one link target (the headline link is stretched over the card; labels are plain text). **large**: 16/9 image, labels, headline, excerpt, byline, date. **standard**: 3/2 image, labels, headline, byline, date. **compact**: 96px square thumbnail beside the headline, or headline only with `thumbnail={false}`; date only, no byline. Each shows the section label, the municipality label and a Tagalog badge only for Tagalog posts. `hero` makes the large headline bigger from 768px. `clamp` cuts headline and excerpt to 3 lines. `priority` only for the first image on a page. One focus ring is drawn around the whole card. |
| `PostLabels` | `post`, `className` | Section label, municipality label and `LanguageBadge`. Plain text, because the whole card is the link. |
| `LanguageBadge` | `language` | Yellow fill, brown text, "Tagalog". Renders nothing for English. |
| `PostDate` | `iso`, `className` | A `time` element with the date in Asia/Manila, for example "November 13, 2026". |
| `SectionHeading` | `title`, `href`, `linkLabel`, `as` h2 or h3, `id` | Heading with a 1px brown rule under it and an optional "See all" link (44px tap target). |
| `Chip` | Link props | Flat text link with a 1px border and a 44px tap target. Tags and municipalities. Has `press` feedback. |
| `SmoothScroll` (client) | none | Lenis smooth scrolling for the whole site, in the layout. Renders nothing. See "Libraries" under "Interaction and motion". |
| `FeaturedSlider` (client) | `children` (one element per slide, rendered on the server), `label` | Carousel for 2 to 5 stories. Slides share one grid cell, so the tallest sets the height before JavaScript runs. Motion fade (in 300ms, out 200ms, `ease-out`); hidden slides are `inert` with opacity 0. A swipe that is not far enough settles back with a Motion spring. Previous, next, Left and Right arrow keys, pause and play. Dots from 640px; below that a plain "2 of 5" count, because five 44px dots and the other controls do not fit a phone. Touch and pen swipe with Pointer Events: the direction is chosen after 10px, the slide follows the finger 1:1, and a drag past 20% of the width or a quick flick changes the slide, otherwise it settles back. A swipe never opens the link under it. The mouse does not drag. Autoplay is 7 seconds, only when reduced motion is not requested, and stops on hover, on focus, while dragging and on pause. The pause button is hidden by CSS under reduced motion. The live region is polite when the reader moves the slide and off while it rotates itself. Never used for a single story. |
| `BreakingStrip` | none | Yellow bar with brown text, "Breaking" and the headline of the newest breaking post. Renders nothing without one. Sets `--focus` to brown inside, so the ring shows in dark theme. |
| `TopicStrip` | `limit` (default 12) | "Topics": chips for the most used tags, each linking to `/tag/[slug]`. Renders nothing without tags. On the home page beside the slider, with `limit` 10. |
| `MunicipalityGrid` | none | "Stories by municipality": one tile per municipality (name and its real story count, "No stories yet" for none). Each tile is one link with a 1px border. 2 columns on phones, 3 from 640px, 5 from 768px. No "See all" link. Each tile links to the archive filtered by that municipality (`/archive?municipality=<slug>`, `href` in `src/config/site.ts`); there are no municipality pages. |
| `SearchBlock` | `id` (prefix, default `find-story`) | "Find a story": a visible label, a `type="search"` input named `q` and a Search button, as a GET form to `/search` with `role="search"`. |
| `StaffCard` | `member` (staff member), `sizes` (required), `headingLevel` h3 or h4, `className` | "Meet the team" card: 1px border, 4px radius, a square picture, then full name (`text-lg`, bold) and position (`text-sm`, muted) under a thin rule. The picture is the staff `photo` through `next/image` (alt "Photo of" and the full name), or with no photo the first letter of the first name large on the brand fill. The card is not a link. |
| `StaffGrid` | `title` (default "Meet the young journalists") | Every staff member as a `StaffCard`: 2 columns on phones, 3 from 640px, 4 from 1024px. Full width on the home page, below the Facebook feed row. Renders nothing without staff. |
| `CallToAction` | `title`, `children` (one paragraph), `actions` (one or two links), `id` (heading id), `as` h2 or h3, `className` | The reusable call to action band for any page: full width, `surface` fill, 1px rules above and below, heading, a `max-w-article` paragraph and buttons (`buttonClasses("accent")` first, `buttonClasses("secondary")` second). Text and buttons side by side from 768px. At most once per page, below the content. |
| `StoryTipCta` | none | "Have news or a story to share?": a `CallToAction` in the layout directly above the footer, so it is the last block before the footer on every page. It invites readers to send a news tip, story idea or photo by message to the Facebook page. The accent button "Send it on Facebook" opens a message to the page (`m.me/<page name>` for a plain page address, the page itself otherwise) in a new tab. "Send it by email" is added as the secondary button when `contactEmail` is set. Renders nothing when neither the Facebook address nor `contactEmail` is set, because it must not invite readers to send something nowhere. |
| `GalleryHighlight` | none | Most recent gallery: four square images, title and date as one link to `/gallery/[slug]` (the title link is stretched over the block, like `PostCard`, with one focus ring). Renders nothing without galleries. |
| `FacebookFeed` | none | Official Page Plugin as a lazy iframe (300 by 600), no Facebook script, plus a text link to the page. Reads `NEXT_PUBLIC_FB_PAGE_URL`. Renders nothing when it is empty or not a facebook.com address. `getFacebookPageUrl()` tells a page whether the column exists. |
| `ArticleNav` | `older`, `newer` (from `getAdjacentPosts`), `className` | Older and newer story links under an article. The label is plain text and the headline is the link. Renders nothing when neither exists. |
| `AuthorBlock` | `authors` (staff members), `className` | "Written by" list: `InitialsBadge`, full name, position. No photos or links. |
| `InitialsBadge` | `name` (a first name), `className` | 44px brand colored square with the first letter of the first name. The default staff picture. Hidden from screen readers. |
| `CorrectionNote` | `children` (the text), `language`, `className` | Flat note with a 1px `brand-border`, a surface fill, the label "Correction" and the text. No icon, no alarm colors. `role="note"`. |
| `ShareRow` | `title`, `path`, `className` | "Share this story" group: Facebook and X as plain links (new tab, no third party script), `CopyLinkButton` and `NativeShareButton`. Facebook and X need the public site address and are left out without it. |
| `CopyLinkButton` (client) | `path`, `url` | Copies the story address. A polite live region (`role="status"`) next to the button says "Copied", or a short failure message, for 4 seconds. |
| `NativeShareButton` (client) | `title`, `path`, `url` | Opens the device share sheet. Renders nothing where `navigator.share` is missing. Decided after hydration with `useSyncExternalStore`, so there is no mismatch. |

New reusable components and tokens get added here and to `/styleguide`. The styleguide shows the motion tokens, `PlaceholderImage` in all four ratios, `PostImage` with and without a `src`, the three `PostCard` variants, `SectionHeading`, `Chip` and `LanguageBadge`, the article components (`CorrectionNote`, `InitialsBadge` with `AuthorBlock`, `ShareRow`, `ArticleNav`), `StaffCard`, `CallToAction` and the `text-article` size.

## Article page
`/article/[slug]` in `src/app/article/[slug]/page.tsx`. Every published post is built by `generateStaticParams`. `dynamicParams` is `false`, so any other address is a 404. Drafts are not in the production build and show in dev.
Order: header (section link, municipality link, Tagalog badge only for Tagalog, h1, excerpt, byline with full names, "Published", "Updated" only with `updatedAt`, reading time), `CorrectionNote` when the post has `correction`, cover figure (`PostImage`, 16/9, `priority`, placeholder when there is no cover), body, share row, tags, `AuthorBlock`, related stories (3, `getRelatedPosts`), `ArticleNav`.
Widths: header, cover, related stories and the older and newer links are `max-w-4xl` (896px). The body, share row, tags and authors are `max-w-article` (42rem). Blocks are separated by thin `border-border` rules. No sticky share bar.
Cover caption: posts have no caption field, so the caption is `coverAlt`, then "Photo: " and `coverCredit` when present. No cover means no caption.
Language: the h1, excerpt, correction and body carry `lang` from the post language.
Body: `Markdown` inside a `text-article wrap-anywhere` wrapper, so long words and addresses wrap. Links in the body are underlined.
Older and newer: "Older story" is the post before in date order and "Newer story" the one after. The newest post has no newer link and the oldest has no older link.
Metadata (`src/lib/article-seo.ts`): title, description (the excerpt), canonical, Open Graph `article` (published and modified time, section, tags, cover or the logo), Twitter card (`summary_large_image` with a cover, `summary` with the logo), one `<meta name="author">` per author, `NewsArticle` and `BreadcrumbList` JSON-LD. Authors are full names in all of them. A date written without a time becomes midnight Philippine time (`+08:00`). Addresses in the JSON-LD are left out when the site address is not known.

## About page
`/about` in `src/app/about/page.tsx`. Read mode, but across the whole 1200px grid (no narrow column with an empty right side). Order: `PageHeader` (h1 "About Punto Publication", the line "Your window to Davao del Sur." and a full width photo band), Who we are (text 7 columns and a photo 5 columns from 1024px, the first paragraph in `text-xl`), Our vision and mission (two columns from 768px in `text-xl`, the client's text word for word), What we do (Punto Broadcast, Punto Print and Inter-School Collaboration, three columns from 768px, each with a 3/2 photo), Our promise (a full width brand band, `text-4xl` statement and the Cebuano line), What we publish (photo on the left, the six sections as `Chip` links to `/archive?section=<slug>` on the right), Meet the young journalists (`StaffGrid`), How to reach us (Facebook message and page links and `contactEmail`, hidden when none exists). The text states no history, dates or numbers, because none were provided. Cebuano text carries `lang="ceb"`, not `tl`. Photos are placeholders until real files are set in `src/config/page-images.ts`.

## Content model
Files in `content/`, loaded by `src/lib/content` (server only). Full how-to steps are in `CONTENT.md`.
- Posts: `content/posts/<slug>.md`, frontmatter plus Markdown body. Fields: `title`, `slug` (same as the file name), `excerpt`, `publishedAt`, `updatedAt`, `section`, `municipality` (both are slugs from `src/config/site.ts`), `tags`, `authors` (staff ids), `language` (`en` or `tl`), `coverImage`, `coverAlt` (required with `coverImage`), `coverCredit`, `featured`, `breaking`, `draft`, `correction`.
- Staff: `content/staff.json`. Fields: `id`, `firstName`, `lastName`, `position`, `municipality`, `bio`, `photo`. Both name fields are required.
- Galleries: `content/galleries/<slug>.json`. Fields: `title`, `slug`, `date`, `municipality`, `description`, `images` (`src` optional, `alt`, `caption`, `credit` optional). An empty `src` renders a placeholder.
- Rules and types: `src/lib/content/schema.ts` (zod, every object is strict). Slug helpers (`tagSlug`, `sectionSlugs`, `getSectionBySlug`, and so on): `src/lib/content/slugs.ts`. Byline: `getByline(post)`, full names (`fullName(member)`, "Ana Reyes").
- Loaders: `getAllPosts`, `getPostBySlug`, `getPostsBySection`, `getPostsByMunicipality`, `getPostsByTag`, `getAllTags`, `getFeaturedPosts`, `getBreakingPost`, `getLatestPosts`, `getRelatedPosts`, `getAdjacentPosts`, `getPostsGroupedByMonth`, `getAllStaff`, `getAuthors`, `getByline`, `getAllGalleries`, `getGalleryBySlug`. Posts are newest first and carry `readingTime` (minutes, 200 words per minute) and `wordCount`. Content is read once per build. Drafts show in dev and are removed from production builds.
- Dates are written in quotes, as `"2026-08-03"` or `"2026-08-03T09:00:00+08:00"`.

## Scripts
`npm run lint`, `npm run typecheck`, `npm run build`, `npm run contrast`, `npm run content:check`. The build runs `content:check` first and stops if any content file breaks a rule.
