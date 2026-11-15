// WCAG AA contrast check for the theme tokens in src/app/globals.css.
// Run: npm run contrast
// Prints a markdown table and exits with code 1 if any pair fails.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const cssPath = fileURLToPath(new URL("../src/app/globals.css", import.meta.url));
const css = readFileSync(cssPath, "utf8");

function readTheme(name) {
  const match = css.match(
    new RegExp(`\\[data-theme="${name}"\\]\\s*\\{([^}]*)\\}`),
  );
  if (!match) throw new Error(`Theme block "${name}" not found in globals.css`);
  const tokens = {};
  for (const [, key, value] of match[1].matchAll(/--([a-z-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)) {
    tokens[key] = value.toLowerCase();
  }
  return tokens;
}

function luminance(hex) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function ratio(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// [foreground, background, minimum ratio, what it is]
// The focus ring is drawn 2px away from the element (outline-offset), so it is
// checked against the surface behind it, not against the element it surrounds.
const TEXT = 4.5; // WCAG AA, normal text
const UI = 3; // WCAG AA, focus rings and control borders
const pairs = [
  ["foreground", "background", TEXT, "Body text on page"],
  ["foreground", "surface", TEXT, "Body text on surface"],
  ["muted", "background", TEXT, "Muted text on page"],
  ["muted", "surface", TEXT, "Muted text on surface"],
  ["link", "background", TEXT, "Link on page"],
  ["link", "surface", TEXT, "Link on surface"],
  ["link-hover", "background", TEXT, "Link hover on page"],
  ["on-brand", "brand", TEXT, "Text on brand fill"],
  ["on-brand-muted", "brand", TEXT, "Muted text on brand fill"],
  ["on-accent", "accent", TEXT, "Brown text on yellow fill"],
  ["focus", "background", UI, "Focus ring on page"],
  ["focus", "surface", UI, "Focus ring on surface"],
  ["border-strong", "background", UI, "Input border on page"],
  ["accent", "brand", UI, "Yellow focus ring on brand (footer)"],
];

let failed = 0;
const rows = [];

for (const theme of ["light", "dark"]) {
  const tokens = readTheme(theme);
  for (const [fg, bg, min, label] of pairs) {
    if (!tokens[fg] || !tokens[bg]) {
      throw new Error(`Missing token for ${fg} or ${bg} in ${theme} theme`);
    }
    const value = ratio(tokens[fg], tokens[bg]);
    const pass = value >= min;
    if (!pass) failed += 1;
    rows.push(
      `| ${theme} | ${label} | ${fg} ${tokens[fg]} | ${bg} ${tokens[bg]} | ${value.toFixed(2)}:1 | ${min}:1 | ${pass ? "Pass" : "FAIL"} |`,
    );
  }
}

console.log("| Theme | Pair | Foreground | Background | Ratio | Needs | Result |");
console.log("| --- | --- | --- | --- | --- | --- | --- |");
console.log(rows.join("\n"));
console.log(
  failed === 0
    ? `\nAll ${rows.length} pairs meet WCAG AA.`
    : `\n${failed} of ${rows.length} pairs fail WCAG AA.`,
);
process.exit(failed === 0 ? 0 : 1);
