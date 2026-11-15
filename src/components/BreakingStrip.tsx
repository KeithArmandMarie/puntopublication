import Link from "next/link";
import { Container } from "@/components/Container";
import { getBreakingPost } from "@/lib/content";

/**
 * A slim yellow bar with brown text, shown only when a post has breaking: true.
 * The focus ring is brown here, because the dark theme focus color is yellow
 * and would vanish on the yellow fill.
 */
export function BreakingStrip() {
  const post = getBreakingPost();
  if (!post) return null;

  return (
    <div className="border-b border-brand bg-accent text-on-accent [--focus:var(--on-accent)]">
      <Container className="flex min-h-11 flex-wrap items-center gap-x-3 py-1 text-sm">
        <strong className="font-extrabold">Breaking</strong>
        <Link
          href={`/article/${post.slug}`}
          lang={post.language}
          className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4 hover:no-underline"
        >
          {post.title}
        </Link>
      </Container>
    </div>
  );
}
