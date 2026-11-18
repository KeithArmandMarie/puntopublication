import Link from "next/link";
import type { AdjacentPosts, Post } from "@/lib/content";

type ArticleNavProps = AdjacentPosts & {
  className?: string;
};

function StoryLink({ post, label, align }: { post: Post; label: string; align: "left" | "right" }) {
  return (
    <div
      className={`group relative rounded-md bg-surface p-6 outline-offset-4 transition-colors duration-(--duration-fast) ease-out hover:bg-border has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-focus ${align === "right" ? "sm:text-right" : ""}`.trim()}
    >
      <p className="text-sm text-muted">{label}</p>
      <Link
        href={`/article/${post.slug}`}
        lang={post.language}
        className="mt-1 block text-xl font-semibold tracking-tight text-foreground underline-offset-4 after:absolute after:inset-0 group-hover:underline focus-visible:outline-none"
      >
        {post.title}
      </Link>
    </div>
  );
}

/** Older and newer story as two panels, the headline as the link text (stretched over the panel). Renders nothing for a lone story. */
export function ArticleNav({ older, newer, className = "" }: ArticleNavProps) {
  if (!older && !newer) return null;
  return (
    <nav
      aria-label="Older and newer stories"
      data-reveal
      className={`grid gap-4 sm:grid-cols-2 ${className}`.trim()}
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
