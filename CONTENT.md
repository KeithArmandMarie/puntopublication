# Content guide

All stories, staff and galleries are plain files. There is no database and no login. To publish, add or change a file, run the check, then commit and push.

| What | Where |
| --- | --- |
| Posts | `content/posts/<slug>.md`, one file per post |
| Staff | `content/staff.json`, one list for everyone |
| Galleries | `content/galleries/<slug>.json`, one file per gallery |
| Sections and municipalities | `src/config/site.ts` |
| Pictures | the `public` folder |

Every sample file starts with the word `sample`. They are listed at the end of this guide, with how to delete them.

## Check your work

Run this after every change. It reads every file, applies every rule and tells you the file and the field of anything wrong. It also runs at the start of `npm run build`, so a broken file can never go live.

```bash
npm run content:check
```

When all is well it prints the counts of posts, drafts, staff, galleries, sections, municipalities and tags.

## 1. Add a post

1. Make sure each author is in `content/staff.json`. If not, add them first (see "Add a staff member").
2. In the folder `content/posts`, create a new file. The file name is the slug of the post: lowercase letters, numbers and single dashes, then `.md`. Example: `new-library-opens.md`.
3. Paste this at the top of the file and change each value:

   ```
   ---
   title: "The headline"
   slug: "new-library-opens"
   excerpt: "One or two sentences that sum up the story."
   publishedAt: "2026-12-01"
   section: "news"
   municipality: "digos-city"
   tags: ["School", "Community"]
   authors: ["ana"]
   language: "en"
   ---

   The story starts here.
   ```

4. Check each field:
   - `slug` must be exactly the file name without `.md`.
   - `publishedAt` is the date. Write it in quotes: `"2026-12-01"`, or with a time `"2026-12-01T09:30:00+08:00"`. Without quotes the check stops with an error.
   - `section` is one section slug: `news`, `features`, `editorial`, `opinion`, `sports` or `literary`.
   - `municipality` is one municipality slug: `digos-city`, `bansalan`, `hagonoy`, `kiblawan`, `magsaysay`, `malalag`, `matanao`, `padada`, `santa-cruz` or `sulop`.
   - `tags` is a list of words in quotes. It can be empty: `[]`. Spell a tag the same way in every post.
   - `authors` is a list of staff ids from `content/staff.json`. At least one.
   - `language` is `"en"` for English or `"tl"` for Tagalog.
5. Add optional fields on their own lines between the two `---` lines when you need them:
   - `updatedAt: "2026-12-02"` when the story was changed later.
   - `featured: true` to show it as a featured story.
   - `breaking: true` to mark it as breaking news. The newest breaking story is the one shown.
   - `draft: true` to keep it off the live site (see "Drafts").
   - `correction: "Text of the correction."` to show a correction note on the story.
6. To add a cover picture, put the picture file in the `public` folder, for example `public/images/new-library.webp`. Then add these lines:

   ```
   coverImage: "/images/new-library.webp"
   coverAlt: "Describe what the picture shows, for someone who cannot see it."
   coverCredit: "Ben"
   ```

   `coverAlt` is required whenever `coverImage` is set. `coverCredit` is optional and must be a first name only. A post with no `coverImage` shows a placeholder block.
7. Write the story under the second `---` line, in Markdown:
   - `# Heading` makes a heading. The post title is already the page title, so `#` shows as a second level heading.
   - `**bold**`, `*italic*`, `[link text](https://example.com)`, `- list item`, `1. numbered item` and `> quote` all work.
   - `![What the picture shows](/images/photo.webp "Optional caption")` adds a picture from the `public` folder. The text in the brackets is required.
   - Raw HTML does not work. The check stops with an error if it finds any.
8. Run `npm run content:check` and fix anything it reports.

## 2. Add a staff member

1. Open `content/staff.json`.
2. Add a new block before the final `]`. Put a comma after the block above it.

   ```
   {
     "id": "dana",
     "firstName": "Dana",
     "position": "Opinion Columnist"
   }
   ```

3. `id` is lowercase letters, numbers and dashes. It must be different from every other id. Posts use this id in `authors`.
4. `firstName` is the first name only. See "First names only".
5. `position` is the role, for example `"Sports Writer"`.
6. Optional fields: `"municipality": "hagonoy"` (a municipality slug), `"bio": "A short bio."` and `"photo": "/staff/dana.webp"` (a file in the `public` folder). With no photo, an initials badge is used.
7. Do not add a last name field. The check rejects any field that is not in this guide.
8. Run `npm run content:check`.

## 3. Add a gallery

1. In the folder `content/galleries`, create a file named after the gallery slug, then `.json`. Example: `town-fiesta-parade.json`.
2. Paste this and change each value:

   ```
   {
     "title": "Gallery title",
     "slug": "town-fiesta-parade",
     "date": "2026-12-01",
     "municipality": "digos-city",
     "description": "One or two sentences about the gallery.",
     "images": [
       {
         "src": "/images/parade-1.webp",
         "alt": "Describe what the picture shows.",
         "caption": "Caption shown under the picture.",
         "credit": "Ana"
       }
     ]
   }
   ```

3. `slug` must be exactly the file name without `.json`.
4. Add one block in `images` for each picture. Separate the blocks with commas.
5. Put each picture file in the `public` folder and write its path in `src`. Leave `src` empty (`"src": ""`) or leave the line out to show a placeholder block. `alt` and `caption` are always required. `credit` is optional and must be a first name only.
6. Run `npm run content:check`.

## 4. Change a section or a municipality

Sections and municipalities are set in one file only: `src/config/site.ts`.

1. Open `src/config/site.ts`.
2. Find `sectionNames` for sections or `municipalityNames` for municipalities.
3. To add one, add its name in quotes to the list. To rename one, change the name. To remove one, delete its line.
4. The slug is made from the name: `"Santa Cruz"` becomes `santa-cruz`. Posts and galleries use the slug.
5. If you rename or remove a name, every post and gallery that used the old slug now fails the check. Run `npm run content:check`, then open each file it names and change the `section` or `municipality` line.
6. Sections are also the links in the site header, so adding or removing a section changes the header.

## 5. First names only

The authors are minors. The site shows first names only: in bylines, on the staff page, in image credits, in metadata, in structured data and in the feed.

1. In `content/staff.json`, `firstName` must be one first name. The check rejects a value with a space, a comma or a period. That stops `"Ana Reyes"`, `"Reyes, Ana"` and `"Ana R."`.
2. There is no last name field. The check rejects any field it does not know, so `lastName` or `surname` cannot be added by mistake.
3. Bylines are built from `firstName` only. A post lists author ids, never names.
4. The check cannot read meaning. You must also keep last names out of these free text fields: `bio`, `coverCredit`, gallery `credit` and `caption`, `excerpt` and the story text. Use the first name only in credits.
5. If you are not sure, leave the name out.

## Drafts

Add `draft: true` to a post to hide it from the live site. In `npm run dev` drafts are visible, so you can preview them. In `npm run build` and on Vercel they are left out. To publish, delete the `draft: true` line.

## Sample content

Delete all of this when real content is ready.

1. Delete every file in `content/posts` whose name starts with `sample-story-`.
2. Delete every file in `content/galleries` whose name starts with `sample-gallery-`.
3. Open `content/staff.json`. It holds six sample staff. Replace the whole file with your real staff, or with `[]` if you have none yet.
4. Run `npm run content:check`.
