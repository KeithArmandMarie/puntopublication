/**
 * Four ratios, and `band`: a wide strip with a fixed height (16rem on phones, 24rem
 * from 640px, 32rem from 1024px), for the photo under a page title. It is a height and not
 * a ratio, so a very wide screen never makes it taller than 32rem.
 */
export type ImageRatio = "16/9" | "4/3" | "3/2" | "1/1" | "band";

/** Written out in full so Tailwind can see every class. */
export const imageRatioClass: Record<ImageRatio, string> = {
  "16/9": "aspect-16/9",
  "4/3": "aspect-4/3",
  "3/2": "aspect-3/2",
  "1/1": "aspect-1/1",
  band: "h-64 sm:h-96 lg:h-128",
};

type PlaceholderImageProps = {
  ratio?: ImageRatio;
  className?: string;
};

/**
 * A flat block in brand colors that stands in for a missing picture.
 * It keeps the same space as a real image, so nothing jumps when one is added.
 * Hidden from screen readers.
 */
export function PlaceholderImage({ ratio = "16/9", className = "" }: PlaceholderImageProps) {
  return (
    <div
      aria-hidden="true"
      className={`flex w-full items-end bg-brand rounded-md ${imageRatioClass[ratio]} ${className}`.trim()}
    >
      <span className="p-2 text-xs text-on-brand-muted">Placeholder</span>
    </div>
  );
}
