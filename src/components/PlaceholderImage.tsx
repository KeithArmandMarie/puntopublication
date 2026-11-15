export type ImageRatio = "16/9" | "4/3" | "3/2" | "1/1";

/** Written out in full so Tailwind can see every class. */
export const imageRatioClass: Record<ImageRatio, string> = {
  "16/9": "aspect-16/9",
  "4/3": "aspect-4/3",
  "3/2": "aspect-3/2",
  "1/1": "aspect-1/1",
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
      className={`flex w-full items-end border border-brand-border bg-brand ${imageRatioClass[ratio]} ${className}`.trim()}
    >
      <span className="p-2 text-xs text-on-brand-muted">Placeholder</span>
    </div>
  );
}
