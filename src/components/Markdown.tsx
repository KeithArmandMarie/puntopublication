import Link from "next/link";
import type { ReactNode } from "react";
import type { Token, Tokens } from "marked";
import { PostImage } from "@/components/PostImage";
import { isSafeHref, lexMarkdown } from "@/lib/content/markdown";

/**
 * Renders a post body. Drop it into the article page:
 *   <Markdown>{post.body}</Markdown>
 *
 * Raw HTML is never rendered. Headings are moved down one level, because the
 * page already has an h1 (the post title): "#" becomes h2, "##" becomes h3.
 * Images must be files in /public and need alt text. The image title, if
 * given, shows as the caption.
 */

const imageSizes = "(min-width: 768px) 700px, 100vw";

function Inline({ tokens }: { tokens: Token[] }): ReactNode {
  return tokens.map((token, index) => <InlineToken key={index} token={token} />);
}

function InlineToken({ token }: { token: Token }): ReactNode {
  switch (token.type) {
    case "text":
    case "escape": {
      const text = token as Tokens.Text;
      return text.tokens ? <Inline tokens={text.tokens} /> : text.text;
    }
    case "strong":
      return <strong className="font-semibold"><Inline tokens={(token as Tokens.Strong).tokens} /></strong>;
    case "em":
      return <em><Inline tokens={(token as Tokens.Em).tokens} /></em>;
    case "del":
      return <del><Inline tokens={(token as Tokens.Del).tokens} /></del>;
    case "codespan":
      return <code className="bg-surface px-1 text-sm">{(token as Tokens.Codespan).text}</code>;
    case "br":
      return <br />;
    case "link": {
      const link = token as Tokens.Link;
      const label = <Inline tokens={link.tokens} />;
      if (!isSafeHref(link.href)) return label;
      if (link.href.startsWith("/") || link.href.startsWith("#")) {
        return <Link href={link.href} className="link" title={link.title ?? undefined}>{label}</Link>;
      }
      return (
        <a href={link.href} className="link" title={link.title ?? undefined} rel="noopener noreferrer">
          {label}
        </a>
      );
    }
    case "image":
      return <Figure image={token as Tokens.Image} />;
    default:
      // Raw HTML and anything unknown is dropped. content:check rejects raw HTML.
      return null;
  }
}

function Figure({ image }: { image: Tokens.Image }) {
  return (
    <figure className="my-6">
      <PostImage image={{ src: image.href, alt: image.text }} sizes={imageSizes} />
      {image.title ? (
        <figcaption className="mt-2 text-sm text-muted">{image.title}</figcaption>
      ) : null}
    </figure>
  );
}

function Blocks({ tokens }: { tokens: Token[] }): ReactNode {
  return tokens.map((token, index) => <Block key={index} token={token} />);
}

function Block({ token }: { token: Token }): ReactNode {
  switch (token.type) {
    case "heading": {
      const heading = token as Tokens.Heading;
      const level = Math.min(heading.depth + 1, 4);
      const className = "mb-3 mt-8 first:mt-0";
      const content = <Inline tokens={heading.tokens} />;
      if (level === 2) return <h2 className={className}>{content}</h2>;
      if (level === 3) return <h3 className={className}>{content}</h3>;
      return <h4 className={className}>{content}</h4>;
    }
    case "paragraph": {
      const paragraph = token as Tokens.Paragraph;
      // A figure cannot sit inside a p, so a paragraph with an image becomes a div.
      const hasImage = paragraph.tokens.some((child) => child.type === "image");
      const content = <Inline tokens={paragraph.tokens} />;
      return hasImage ? (
        <div className="mt-4 first:mt-0">{content}</div>
      ) : (
        <p className="mt-4 first:mt-0">{content}</p>
      );
    }
    case "text": {
      const text = token as Tokens.Text;
      return text.tokens ? <Inline tokens={text.tokens} /> : text.text;
    }
    case "blockquote":
      return (
        <blockquote className="my-6 border-y border-border py-4 text-lg italic">
          <Blocks tokens={(token as Tokens.Blockquote).tokens} />
        </blockquote>
      );
    case "list": {
      const list = token as Tokens.List;
      const items = list.items.map((item, index) => (
        <li key={index} className="mt-1">
          <Blocks tokens={item.tokens} />
        </li>
      ));
      return list.ordered ? (
        <ol className="mt-4 list-decimal pl-6 first:mt-0" start={typeof list.start === "number" ? list.start : undefined}>
          {items}
        </ol>
      ) : (
        <ul className="mt-4 list-disc pl-6 first:mt-0">{items}</ul>
      );
    }
    case "code":
      return (
        <pre className="mt-4 overflow-x-auto border border-border bg-surface p-4 text-sm">
          <code>{(token as Tokens.Code).text}</code>
        </pre>
      );
    case "hr":
      return <hr className="my-8" />;
    default:
      return null;
  }
}

type MarkdownProps = {
  /** The Markdown text, for example post.body. */
  children: string;
  className?: string;
};

export function Markdown({ children, className = "" }: MarkdownProps) {
  return (
    <div className={`max-w-prose ${className}`.trim()}>
      <Blocks tokens={lexMarkdown(children)} />
    </div>
  );
}
