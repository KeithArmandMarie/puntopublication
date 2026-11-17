# Project status and history

Handoff note for any Claude chat that picks up this project. Read it with `CLAUDE.md`, `DESIGN.md` and `CONTENT.md`. Those three hold the rules. This file holds what has happened and what is left. If this file and the code disagree, the code wins and this file gets updated.

Last updated: 2026-11-16 (home page redo to the new `DESIGN.md`).

## What this is
Punto Publication, the Provincial Youth Journalist Publication of Davao del Sur. A static Next.js news site in English and Tagalog, phones first. Content is Markdown and JSON files, no database, no logins. The authors are adults, so the site shows full names (first and last) everywhere.

## Where it lives
- GitHub: `KeithArmandMarie/puntopublication`, branch `main`.
- Vercel: project `puntopublication` (team `caballerokeith2gmailcoms-projects`), linked to that repo. Every push to `main` deploys to production.
- Live: https://puntopublication.vercel.app
- Environment variables (both optional, set in Vercel Project Settings):
  - `NEXT_PUBLIC_FB_PAGE_URL` = `https://www.facebook.com/PUNTOPublication` (set for Production, Preview and Development). It is read at build time, so changing it needs a redeploy.
  - `NEXT_PUBLIC_SITE_URL` is not set. Canonical and share links already fall back to the Vercel production address. Set it only for a custom domain.

## History, in order
1. Phase 1: design foundation, tokens, theme toggle, header and footer.
2. Phase 2: content system (typed loaders, sample content, content checks).
3. Phase 3 was first built as home, article and section pages in one commit (`544126b`). The user asked to undo it and build the home page only, so it was reverted (`e6e2285`) and the home page was rebuilt on its own (`4874a8a`).
4. Standard `Banner` added at the top; the slider and latest headlines became the second section, `#top-stories` (`f6ab01e`).
5. Banner made full screen with the motto as the h1 and the tagline as the paragraph; the theme toggle now shows a moon in light and a sun in dark (`fc4cb81`).
6. Article page `/article/[slug]` built in a separate chat (`62f2de8`).
7. Pushed to GitHub, deployed to Vercel, Facebook page address set and redeployed.
8. `DESIGN.md` gained the design skills, motion, principles and "Before a page is done" sections. The home page was then brought in line with them (2026-11-16): motion tokens, the `hover:` variant limited to real pointers, the `press` utility, `touch-action`, the mobile menu sheet fade, slider tokens with a 1:1 touch swipe and a phone counter, the gallery block as one link, no image `priority` below the full screen banner, the banner paragraph at `max-w-article`, and browser parts (scrollbar, caret, accent) themed.

9. Added `lenis` (`SmoothScroll` in the layout) and `motion` (`FeaturedSlider` fades and a spring settle after a swipe). `data-lenis-prevent` is on the mobile menu dialog. In page links are handled by `SmoothScroll`.

## What is built
Routes: `/`, `/article/[slug]`, `/archive`, `/about` and the unindexed `/styleguide`.
About (`/about`, built 2026-11-17): client's "who we are" text (lengthened without adding facts), the client's vision and mission word for word, the three platforms (Punto Broadcast, Punto Print, Inter-School Collaboration), the promise, the sections, the team and how to reach us. Changes made to the client's text: "premier" was dropped (a claim of being the best), "Our mission is to bridge the gap" became "We work to bridge the gap" (so there is one Mission on the page), the emoji and the fancy bold Unicode letters were replaced by plain text, and the promise lines in Cebuano are marked `lang="ceb"`, not Tagalog. No video page exists, so Punto Broadcast has no link.
Photo pages (2026-11-17): the user asked for a photo on every page and a layout that fills the screen, inspired by Awwwards, kept within the rules (no gradients, blur, parallax or reveals; the home banner uses one flat scrim). `PageHeader` (title, paragraph, full width photo band) now starts `/about` and `/archive` and must start every new inner page. Photo slots are in `src/config/page-images.ts` and show placeholders until the client sends real photos; a photo needs alt text and a first name credit or the build fails. Photos of people need their consent.
Archive (`/archive`, built 2026-11-16, widened 2026-11-17 with the filters in a left column from 1024px): `PageHeader`, section chips and a municipality select, then compact story rows grouped by month, newest first, 20 at first and a "Show more stories" button. The filter is in the address (`?section=news&municipality=hagonoy`) and runs in the browser, so the page stays static. The sections have no pages of their own.
Home page, top to bottom: breaking strip inside the full screen `Banner` (the Capitol photo, `public/images/punto-homepage-banner.webp`, converted to WebP from the client's JPG, is the background of the whole banner under a flat 66% dark brown scrim, so the text stays readable), then the featured slider (`#top-stories`) with Latest headlines (four stories, then a "See all published stories" link to `/archive`), "Find a story" (`SearchBlock`) and Topics (`TopicStrip`) beside it, Stories by municipality (`MunicipalityGrid`) and the gallery highlight with the Facebook feed column beside them, then Meet the young journalists (`StaffGrid`, `StaffCard` cards with picture, full name and position, full width). Latest stories and the News, Features and Opinion blocks were removed on 2026-11-16 because they repeated the same stories; Latest headlines was kept (removed, then brought back with the archive link). `StoryTipCta` (built on the reusable `CallToAction`) sits in the layout above the footer on every page. It invites readers to send a news tip or story by message to the Facebook page ("Send it on Facebook"), plus an email button when `contactEmail` is set. It is hidden when neither is set.
Copy lives in `src/config/site.ts`: `motto` ("In Truth, We Serve. In Words, We Lead.") is the banner h1, `tagline` ("Empowering the Voice of the Youth through Responsible Journalism.") is the banner paragraph and the footer line.
`DESIGN.md` lists every component with its props. Reuse them before making new ones.

## Linked but not built yet
`/tag/[slug]`, `/gallery`, `/gallery/[slug]`, `/search`, and the policy pages `/editorial-policy`, `/corrections`, `/ethics`, `/privacy`, `/terms`. Links to them already exist on the site and currently 404. Build them with the routes exactly as written here. Municipality pages (`/municipality`, `/municipality/[slug]`) were dropped on 2026-11-17: no nav, footer or "See all" link, and municipality labels and home tiles link to `/archive?municipality=<slug>`. A proposal for the index page was made but not approved.

## Decisions the user made
- Home page only for that phase; other pages are separate tasks. Build only the page or task asked for.
- The banner heading is the motto, not the site name. Do not put marketing claims, stats or invented history in the copy.
- The theme toggle icon follows the theme (moon in light, sun in dark).
- Ask before adding any dependency. Two were approved on 2026-11-16: `lenis` (smooth scrolling for the whole site) and `motion` (slider fade and swipe settle). The user chose to keep them within the existing rules: no scroll reveals, stagger or page transitions.
- The user wants lint, type check, content check, contrast and build to pass, and the page checked at 360, 768 and 1280 in light and dark, before saying done.

- Header (decided 2026-11-16, Municipalities removed 2026-11-17 until the page is designed): links are About, Gallery and Archive, plus two buttons, "Send a tip" and "Follow on Facebook". The six sections are not pages and not header links: they are a filter on `/archive`. There are no `/section/[slug]` routes. "Services" was dropped, because the publication has nothing real to list there.

- Author names (decided 2026-11-17): the journalists are adults and the site shows full names. Staff have `firstName` and `lastName`, both required, and `fullName(member)` builds the name for bylines, cards, credits, metadata and structured data. The six sample staff have the placeholder last name "Sample" until the client sends the real team list. The first-names-only checks on credits were removed.

- Home banner (2026-11-17): the first version put the text on a brown panel beside the photo, and the user disliked it. The photo is now the background of the whole banner. A flat scrim (`--scrim` #1b0e06 at `--scrim-opacity` 0.66, no gradient or blur, drawn by `Banner` with the utilities `bg-(--scrim) opacity-(--scrim-opacity)`) sits between the photo and the text. `npm run contrast` checks the text against the worst case, a white photo (5.87:1 against 4.5:1), so any replacement photo stays readable. It was first a custom class `.photo-scrim` in `globals.css` using `color-mix()`; the dev server served a stale build of that CSS and the tint did not show, so it is now utilities in the component. Lesson: the dev server's CSS can lag behind `globals.css` edits on this machine. If styles look wrong in `npm run dev`, restart it before debugging, and trust a fresh `npm run build` and `npx next start`.

## Things to know before you change code
- Tokens only. No hardcoded colors, sizes or spacing. No gradients, shadows, blur, glow, emoji or all caps text. Yellow is a fill with brown text, never text on a light background.
- Server components by default. Client components exist only for the slider, the theme toggle, the mobile menu, the copy and share buttons and two small date helpers.
- Motion is built: use the tokens, `press`, `.sheet` and `ease-out` described under "Interaction and motion" in `DESIGN.md`. `hover:` only fires on a fine pointer.
- On the home page the banner photo is the first big image and has `priority`; no story image below it does.
- The browser pane only draws while the Claude window is visible. When it is hidden, clicks, screenshots, transitions and dialog `close` events do not run, so test interaction with the window in front.
- The banner takes the breaking strip through its `above` prop so the two together fill the screen height (`100svh` minus the header). Do not render the strip separately above it.
- `NEXT_PUBLIC_*` values are inlined at build time.
- `DESIGN.md` now also names the skills used for design decisions (ui-ux-pro-max, impeccable, emil-design-eng, apple-design) and says a project rule always beats a skill. Its motion section is a standard for new work; only the slider fade is built so far.
- Windows machine. Use the Bash tool for shell scripts. Run a production check with `npx next start -p 3100` and stop it afterwards; a `next dev` from another chat may already be on port 3000.
- Sample content (files starting with `sample`) is placeholder and is listed in `CONTENT.md` with how to delete it.

## Open items
- Look at the live site in a browser and confirm the Facebook feed renders (the page must be public and allow embedding).
- Decide on a custom domain, then set `NEXT_PUBLIC_SITE_URL`.
- The default share image is `public/brand/logo.webp` at about 500 KB. A roughly 1200px copy would be better for link previews.
- Posts have no cover caption field; the article page uses `coverAlt` plus the credit.
- Motion pass: done for the home page, header, mobile menu, `Button` and `Chip` (so the article share row has press feedback too). The article page as a whole has not been re-checked against the new checklist.
- Not verified with the window in front: Lenis gliding to `#top-stories` from the banner button (the browser pane was hidden, so animation frames did not run). The slider swipe, the spring settle and the fades were checked.
- Not measured: the menu sheet and slider fade timings frame by frame and on a real phone (rule 12 of the motion section). The end states were checked.
- Build the unbuilt routes above, one task at a time.
- Not yet checked: the banner with no breaking post. (Dark theme and 768px were checked on 2026-11-16.)

## Skills installed on this machine
Emil Kowalski's skills were updated from `github.com/emilkowalski/skills` and match it. `ui-ux-pro-max` and `ui-ux-designer` are installed as plain skill folders. The first pages were built without them; only an impeccable design hook ran automatically after edits. The home page redo used impeccable (its craft floor, then `impeccable detect`, which found nothing) and the motion and checklist sections of `DESIGN.md`. There is still no `PRODUCT.md`; `/impeccable init` can write one.
`.claude/launch.json` has a `prod` entry (`npx next start -p 3100`) for production checks in the browser pane. Run `npm run build` first and restart it after each build.
