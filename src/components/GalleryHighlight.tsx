import Link from "next/link";
import { PostDate } from "@/components/PostDate";
import { PostImage } from "@/components/PostImage";
import { SectionHeading } from "@/components/SectionHeading";
import { getAllGalleries } from "@/lib/content";

/** The most recent gallery with four of its images. Hidden when there are no galleries. */
export function GalleryHighlight() {
  const gallery = getAllGalleries()[0];
  if (!gallery) return null;

  const href = `/gallery/${gallery.slug}`;

  return (
    <section aria-labelledby="gallery-highlight-heading">
      <SectionHeading title="Latest gallery" id="gallery-highlight-heading" />
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {gallery.images.slice(0, 4).map((image, position) => (
          <PostImage
            key={position}
            image={image}
            ratio="1/1"
            sizes="(min-width: 1024px) 180px, (min-width: 640px) 20vw, 50vw"
          />
        ))}
      </div>
      <h3 className="mt-3 text-lg font-bold tracking-tight">
        <Link href={href} className="text-foreground underline-offset-4 hover:underline">
          {gallery.title}
        </Link>
      </h3>
      <p className="text-sm text-muted">
        <PostDate iso={gallery.date} />
      </p>
      <Link href={href} className="link mt-1 inline-flex min-h-11 items-center text-sm font-semibold">
        View the gallery
      </Link>
    </section>
  );
}
