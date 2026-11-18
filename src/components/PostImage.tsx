import Image from "next/image";
import { imageRatioClass, PlaceholderImage } from "@/components/PlaceholderImage";
import type { ImageRatio } from "@/components/PlaceholderImage";
import type { ImageData, Post } from "@/lib/content/schema";

type PostImageProps = {
  /** Passing a post uses its cover image and cover alt text. */
  post?: Post;
  /** Or pass any image, such as one from a gallery. An empty src shows the placeholder. */
  image?: ImageData;
  /** Required. Tells the browser how wide the image is shown, for example "(min-width: 768px) 50vw, 100vw". */
  sizes: string;
  ratio?: ImageRatio;
  /** Use on the first image on a page. Loads it right away instead of lazily. */
  priority?: boolean;
  className?: string;
};

function pick(post?: Post, image?: ImageData): ImageData {
  if (post) return { src: post.coverImage, alt: post.coverAlt ?? "" };
  if (image) return image;
  throw new Error("PostImage needs either a post or an image.");
}

/**
 * A post cover or gallery image at a fixed ratio. Real pictures go through
 * next/image. With no src it shows PlaceholderImage. Both take the same space.
 */
export function PostImage({
  post,
  image,
  sizes,
  ratio = "16/9",
  priority = false,
  className = "",
}: PostImageProps) {
  const { src, alt } = pick(post, image);

  if (!src) {
    return <PlaceholderImage ratio={ratio} className={className} />;
  }

  return (
    <div
      className={`relative w-full overflow-hidden bg-surface ${ratio === "band" ? "" : "rounded-md"} ${imageRatioClass[ratio]} ${className}`.trim()}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        className="object-cover"
      />
    </div>
  );
}
