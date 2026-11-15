// Loads every post, staff member and gallery, runs all the rules and prints counts.
// Run: npm run content:check
// Exits with code 1 and a message that names the file and the field on any problem.
// Also runs at the start of npm run build.

import { register } from "node:module";
import { fileURLToPath } from "node:url";

// The content folder is found from the project root, wherever this is run from.
process.chdir(fileURLToPath(new URL("..", import.meta.url)));
register("./ts-hooks.mjs", import.meta.url);

const { loadContent } = await import("../src/lib/content/load.ts");
const { ContentError } = await import("../src/lib/content/errors.ts");
const { tagSlug } = await import("../src/lib/content/slugs.ts");
const { sections, municipalities } = await import("../src/config/site.ts");

try {
  const { posts, staff, galleries } = loadContent();

  const drafts = posts.filter((post) => post.draft);
  const published = posts.filter((post) => !post.draft);
  const usedSections = new Set(posts.map((post) => post.section));
  const usedMunicipalities = new Set(posts.map((post) => post.municipality));
  const tags = new Set(posts.flatMap((post) => post.tags.map(tagSlug)));

  const rows = [
    ["Posts", `${published.length} published`],
    ["Drafts", `${drafts.length} (left out of production builds)`],
    ["Staff", String(staff.length)],
    ["Galleries", String(galleries.length)],
    ["Sections", `${sections.length} in config, ${usedSections.size} with posts`],
    ["Municipalities", `${municipalities.length} in config, ${usedMunicipalities.size} with posts`],
    ["Tags", String(tags.size)],
  ];

  console.log("Content check passed.\n");
  for (const [label, value] of rows) {
    console.log(`  ${label.padEnd(15)}${value}`);
  }
  console.log("");
} catch (error) {
  if (error instanceof ContentError) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
}
