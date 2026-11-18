import Link from "next/link";
import { PostDate } from "@/components/PostDate";
import { PostImage } from "@/components/PostImage";
import { PostLabels } from "@/components/PostLabels";
import { getByline } from "@/lib/content";
import type { Post } from "@/lib/content";

export type PostCardVariant = "large" | "standard" | "compact";

type PostCardProps = {
  post: Post;
  variant?: PostCardVariant;
  /** Heading level of the headline. Pick the one that fits the page outline. Defaults to h3. */
  headingLevel?: "h2" | "h3" | "h4";
  /** large and standard: loads the image right away. Only for the first image on a page. */
  priority?: boolean;
  /** large only: a bigger headline from 768px. For the lead story of a page or the slider. */
  hero?: boolean;
  /** compact only: show a small thumbnail beside the headline. Defaults to true. */
  thumbnail?: boolean;
  /** Cuts the headline and the excerpt to three lines. Used where equal heights matter, such as the slider. */
  clamp?: boolean;
  /** Tells the browser how wide the image is shown. Each variant has a sensible default. */
  sizes?: string;
  className?: string;
};

const defaultSizes: Record<PostCardVariant, string> = {
  large: "(min-width: 1024px) 800px, 100vw",
  standard: "(min-width: 1024px) 384px, (min-width: 640px) 50vw, 100vw",
  compact: "96px",
};

const titleClass: Record<PostCardVariant, string> = {
  large: "text-xl font-semibold md:text-2xl",
  standard: "text-lg font-semibold",
  compact: "text-base font-semibold",
};

/**
 * A story as a card. The whole card is one link: the headline link is
 * stretched over it, so the labels are plain text and a screen reader
 * meets one link per story. Keyboard focus draws one ring around the card.
 */
export function PostCard({
  post,
  variant = "standard",
  headingLevel = "h3",
  priority = false,
  hero = false,
  thumbnail = true,
  clamp = false,
  sizes,
  className = "",
}: PostCardProps) {
  const Heading = headingLevel;
  const isCompact = variant === "compact";
  const showThumbnail = isCompact && thumbnail;
  const byline = getByline(post);

  const headline = (
    <Heading
      lang={post.language}
      className={`${hero && variant === "large" ? "text-2xl font-semibold md:text-3xl" : titleClass[variant]} tracking-tight ${clamp ? "line-clamp-3" : ""}`.trim()}
    >
      <Link
        href={`/article/${post.slug}`}
        className="text-foreground after:absolute after:inset-0 group-hover:underline focus-visible:outline-none"
      >
        {post.title}
      </Link>
    </Heading>
  );

  const meta = (
    <p className="flex flex-wrap gap-x-3 text-sm text-muted [&>*+*]:border-l [&>*+*]:border-border [&>*+*]:pl-3">
      {isCompact ? null : <span>By {byline}</span>}
      <PostDate iso={post.publishedAt} />
    </p>
  );

  return (
    <article
      className={`group relative outline-offset-4 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-focus ${className}`.trim()}
    >
      {showThumbnail ? (
        <div className="flex gap-4">
          <div className="w-24 shrink-0">
            <PostImage post={post} ratio="1/1" sizes={sizes ?? defaultSizes.compact} />
          </div>
          <div className="min-w-0">
            <PostLabels post={post} className="mb-1" />
            {headline}
            <div className="mt-1">{meta}</div>
          </div>
        </div>
      ) : isCompact ? (
        <div>
          <PostLabels post={post} className="mb-1" />
          {headline}
          <div className="mt-1">{meta}</div>
        </div>
      ) : (
        <div>
          <PostImage
            post={post}
            ratio={variant === "large" ? "16/9" : "3/2"}
            sizes={sizes ?? defaultSizes[variant]}
            priority={priority}
          />
          <PostLabels post={post} className="mb-1 mt-3" />
          {headline}
          {variant === "large" ? (
            <p
              lang={post.language}
              className={`mt-2 text-base text-foreground ${clamp ? "line-clamp-3" : ""}`.trim()}
            >
              {post.excerpt}
            </p>
          ) : null}
          <div className="mt-2">{meta}</div>
        </div>
      )}
    </article>
  );
}
