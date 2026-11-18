/**
 * Photo slots for the pages that are not stories. Every slot starts empty and shows a
 * placeholder block that keeps the right space. To add a real photo:
 *
 * 1. Put the file in `public/images/pages/` (a WebP, about 1600px wide for a band, 1000px
 *    for the others).
 * 2. Set `src` to its path, for example "/images/pages/about-header.webp".
 * 3. Set `alt` to a description for someone who cannot see it. It is required with a `src`.
 *    The build fails without it.
 * 4. Optionally set `credit` to the photographer's name. It shows as "Photo: Ana Reyes".
 *
 * A new page adds its own entry here, so every page has a photo slot.
 */
export type PageImage = {
  /** Empty shows the placeholder. */
  src: string;
  /** What the photo shows. Required when `src` is set. */
  alt: string;
  /** The photographer's name. Shown as "Photo: Ana Reyes" under the photo. */
  credit?: string;
};

export const pageImages = {
  home: {
    /** The home page banner: the Capitol with the Punto seal, converted to WebP from `punto homepage banner.jpg`. */
    banner: {
      src: "/images/punto-homepage-banner.webp",
      alt: "Aerial view of the Davao del Sur Provincial Capitol with the Punto Publication seal in the roundabout and an eagle in flight.",
    },
  },
  about: {
    header: { src: "", alt: "" },
    who: { src: "", alt: "" },
    broadcast: { src: "", alt: "" },
    print: { src: "", alt: "" },
    collaboration: { src: "", alt: "" },
    publish: { src: "", alt: "" },
  },
  archive: {
    header: { src: "", alt: "" },
  },
  team: {
    header: { src: "", alt: "" },
  },
} satisfies Record<string, Record<string, PageImage>>;
