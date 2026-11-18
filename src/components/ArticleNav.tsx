import Link from "next/link";
import type { AdjacentPosts, Post } from "@/lib/content";

type ArticleNavProps = AdjacentPosts & {
  className?: string;
};

function StoryLink({ post, label, align }: { post: Post; label: string; align: "left" | "right" }) {
  return (
    <div className={align === "right" ? "sm:text-right" : undefined}>
      <p className="text-sm text-muted">{label}</p>
      <Link
        href={`/article/${post.slug}`}
        lang={post.language}
        className="link block py-2 text-lg font-bold"
      >
        {post.title}
      </Link>
    </div>
  );
}

/** Older and newer story, with the headline as the link text. Renders nothing for a lone story. */
export function ArticleNav({ older, newer, className = "" }: ArticleNavProps) {
  if (!older && !newer) return null;
  return (
    <nav
      aria-label="Older and newer stories"
      data-reveal
      className={`grid gap-6 border-y border-border py-6 sm:grid-cols-2 ${className}`.trim()}
    >
      {older ? <StoryLink post={older} label="Older story" align="left" /> : null}
      {newer ? (
        <div className={older ? undefined : "sm:col-start-2"}>
          <StoryLink post={newer} label="Newer story" align="right" />
        </div>
      ) : null}
    </nav>
  );
}
