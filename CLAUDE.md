# Punto Publication

Provincial Youth Journalist Publication, Davao del Sur. News site for the general public in English and Tagalog. Phones first. Next.js App Router, TypeScript strict, Tailwind, deployed on Vercel. Content is Markdown files, no database, no logins.

@DESIGN.md
@CONTENT.md
@PROJECT-STATUS.md

## Before you build anything
1. Read DESIGN.md and src/app/globals.css.
2. Look in src/components before making a new component. Reuse what exists.
3. Never hardcode a color, font size or spacing value. Use the CSS variables and the Tailwind tokens from DESIGN.md.

## Design rules that never change
Colors: background #fafafa, brand brown #5F2805, accent yellow #FFD939, all as CSS variables with a light and a dark theme.
Font: Plus Jakarta Sans only. No all caps text and no letter spaced labels.
Style: flat, clean, newspaper like. 1px borders and thin rules, radius 4px at most, almost no shadows.
Yellow is a fill with brown text on top. Never yellow text on a light background.
No gradients, glow, blur, glassmorphism, emoji in the UI, purple or blue default palettes, icon card rows, fake stats, testimonials or filler marketing copy.
No invented claims, awards, numbers or history about the publication.
Meet WCAG AA contrast in both themes.

## Child safety rule
Authors are minors. Show first names only everywhere: bylines, staff page, image credits, metadata, structured data, RSS.

## Code rules
Small typed components. Server components by default, client components only when needed. All pages statically generated. Use Next Image with sizes and alt text. Keep dependencies minimal and ask before adding any. Approved animation dependencies: `lenis` (smooth scrolling, whole site) and `motion` (through `LazyMotion` and `m`). Their rules are under "Interaction and motion" in DESIGN.md. Reduced motion turns both off. Page transitions, scroll reveals, parallax and stagger stay out.

## Working rules
Build only the page or task I ask for. Do not touch unrelated files.
Run lint, type check and build before saying you are done, then fix errors.
If you create a new reusable component or token, add it to DESIGN.md.
If a request conflicts with these rules, tell me before building.
