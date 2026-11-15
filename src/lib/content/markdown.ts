import { Lexer } from "marked";
import type { Token } from "marked";

/**
 * Markdown helpers shared by the loaders (word count, body checks) and the
 * Markdown component (rendering). Pure code, no file access.
 *
 * Supported: headings, paragraphs, bold, italic, links, images, lists,
 * blockquotes, code and horizontal rules. Raw HTML is not supported.
 */

export function lexMarkdown(body: string): Token[] {
  return new Lexer({ gfm: false }).lex(body);
}

type Parent = Token & { tokens?: Token[]; items?: Token[] };

function children(token: Token): Token[] {
  // The text inside an image is its alt text, which is not read as part of the story.
  if (token.type === "image") return [];
  const parent = token as Parent;
  return [...(parent.tokens ?? []), ...(parent.items ?? [])];
}

function walk(tokens: Token[], visit: (token: Token) => void): void {
  for (const token of tokens) {
    visit(token);
    walk(children(token), visit);
  }
}

/** Links may go to the site, to a section of the page, to the web or to an email address. */
export function isSafeHref(href: string): boolean {
  return /^(\/(?!\/)|#|https?:\/\/|mailto:)/i.test(href);
}

/** Images must be files in /public, so next/image can size them. */
export function isLocalImage(href: string): boolean {
  return /^\/(?!\/)\S*$/.test(href);
}

/** Number of words a reader will read. Link addresses and image text are not counted. */
export function countWords(body: string): number {
  const parts: string[] = [];
  walk(lexMarkdown(body), (token) => {
    const hasChildren = children(token).length > 0;
    if ((token.type === "text" && !hasChildren) || token.type === "codespan" || token.type === "code") {
      parts.push((token as { text: string }).text);
    }
  });
  const words = parts.join(" ").split(/\s+/).filter((word) => word !== "");
  return words.length;
}

/** Reading time in whole minutes, never less than 1. */
export function readingMinutes(wordCount: number, wordsPerMinute = 200): number {
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/** Problems in a post body that would break or weaken the page. Empty means fine. */
export function findBodyProblems(body: string): string[] {
  const problems: string[] = [];
  walk(lexMarkdown(body), (token) => {
    if (token.type === "html") {
      problems.push(
        `raw HTML is not supported (found "${(token as { raw: string }).raw.trim().slice(0, 40)}"). Use Markdown instead.`,
      );
    }
    if (token.type === "image") {
      const image = token as { href: string; text: string };
      if (image.text.trim() === "") {
        problems.push(`image "${image.href}" has no alt text. Write it inside the brackets: ![description](${image.href}).`);
      }
      if (!isLocalImage(image.href)) {
        problems.push(
          `image "${image.href}" must be a file in the public folder, written as a path that starts with one slash.`,
        );
      }
    }
    if (token.type === "link") {
      const link = token as { href: string };
      if (!isSafeHref(link.href)) {
        problems.push(
          `link "${link.href}" is not allowed. Links must start with /, #, http://, https:// or mailto:.`,
        );
      }
    }
  });
  return problems;
}
