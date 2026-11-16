# Project status and history

Handoff note for any Claude chat that picks up this project. Read it with `CLAUDE.md`, `DESIGN.md` and `CONTENT.md`. Those three hold the rules. This file holds what has happened and what is left. If this file and the code disagree, the code wins and this file gets updated.

Last updated: 2026-11-16 (home page redo to the new `DESIGN.md`).

## What this is
Punto Publication, the Provincial Youth Journalist Publication of Davao del Sur. A static Next.js news site in English and Tagalog, phones first. Content is Markdown and JSON files, no database, no logins. The authors are minors, so first names only everywhere.

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
Routes: `/`, `/article/[slug]` and the unindexed `/styleguide`.
Home page, top to bottom: breaking strip inside the full screen `Banner`, then the featured slider with the latest headlines (`#top-stories`), latest stories grid, News, Features and Opinion blocks, municipality chips, gallery highlight, Facebook feed column.
Copy lives in `src/config/site.ts`: `motto` ("In Truth, We Serve. In Words, We Lead.") is the banner h1, `tagline` ("Empowering the Voice of the Youth through Responsible Journalism.") is the banner paragraph and the footer line.
`DESIGN.md` lists every component with its props. Reuse them before making new ones.

## Linked but not built yet
`/section/[slug]` (with `/section/[slug]/page/[n]`), `/tag/[slug]`, `/municipality`, `/municipality/[slug]`, `/archive`, `/gallery/[slug]`, `/search`, and the policy pages `/editorial-policy`, `/corrections`, `/ethics`, `/privacy`, `/terms`. Links to them already exist on the site and currently 404. Build them with the routes exactly as written here.

## Decisions the user made
- Home page only for that phase; other pages are separate tasks. Build only the page or task asked for.
- The banner heading is the motto, not the site name. Do not put marketing claims, stats or invented history in the copy.
- The theme toggle icon follows the theme (moon in light, sun in dark).
- Ask before adding any dependency. Two were approved on 2026-11-16: `lenis` (smooth scrolling for the whole site) and `motion` (slider fade and swipe settle). The user chose to keep them within the existing rules: no scroll reveals, stagger or page transitions.
- The user wants lint, type check, content check, contrast and build to pass, and the page checked at 360, 768 and 1280 in light and dark, before saying done.

## Things to know before you change code
- Tokens only. No hardcoded colors, sizes or spacing. No gradients, shadows, blur, glow, emoji or all caps text. Yellow is a fill with brown text, never text on a light background.
- Server components by default. Client components exist only for the slider, the theme toggle, the mobile menu, the copy and share buttons and two small date helpers.
- Motion is built: use the tokens, `press`, `.sheet` and `ease-out` described under "Interaction and motion" in `DESIGN.md`. `hover:` only fires on a fine pointer.
- On the home page the full screen banner fills the first screen, so no story image gets `priority`; the header logo is the first image.
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
