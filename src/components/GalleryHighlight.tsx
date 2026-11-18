import Link from "next/link";
import { PostDate } from "@/components/PostDate";
import { PostImage } from "@/components/PostImage";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllGalleries } from "@/lib/content";

/**
 * The most recent gallery with four of its images. Hidden when there are no galleries.
 * Like PostCard, the whole block is one link: the title link is stretched over the
 * images, so the tap target is large and keyboard focus draws one ring around it.
 */
export function GalleryHighlight() {
  const gallery = getAllGalleries()[0];
  if (!gallery) return null;

  return (
    <section aria-labelledby="gallery-highlight-heading">
      <SectionHeading title="Latest gallery" id="gallery-highlight-heading" />
      <div className="group relative mt-6 outline-offset-4 has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-focus">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {gallery.images.slice(0, 4).map((image, position) => (
            <PostImage
              key={position}
              image={image}
              ratio="1/1"
              sizes="(min-width: 1024px) 180px, (min-width: 640px) 20vw, 50vw"
            />
          ))}
        </div>
        <h3 className="mt-3 text-lg font-semibold tracking-tight">
          <Link
            href={`/gallery/${gallery.slug}`}
            className="text-foreground underline-offset-4 after:absolute after:inset-0 group-hover:underline focus-visible:outline-none"
          >
            {gallery.title}
          </Link>
        </h3>
        <p className="text-sm text-muted">
          <PostDate iso={gallery.date} />
        </p>
      </div>
    </section>
  );
}
