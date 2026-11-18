"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Scroll reveal for the whole site. Renders nothing.
 *
 * Any element with a `data-reveal` attribute that starts below the visible screen is set
 * to `data-reveal-state="hidden"` (see globals.css: transparent and a small way down), and
 * to `"shown"` once it is well inside the screen, which fades it in and moves it up (see
 * the `--duration-reveal*` tokens). It happens once per element. Everything already on screen, or above it,
 * is left alone, so nothing flashes on load. The server HTML is fully visible: the hidden
 * state is only ever applied here, after hydration, so with no JavaScript, or when the
 * observer is missing, the page simply shows all its content.
 *
 * Off when the reader asks for reduced motion. The attribute is read again on each page
 * change, because the layout (and this component) stays mounted between pages.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (
      !("IntersectionObserver" in window) ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const waiting = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-reveal-state", "shown");
          observer.unobserve(entry.target);
          waiting.delete(entry.target);
        }
      },
      // Reveal once the block is well inside the screen, so the fade is seen and not
      // spent at the very edge where almost none of it shows.
      { rootMargin: "0px 0px -22% 0px" },
    );

    for (const element of document.querySelectorAll("[data-reveal]")) {
      // In view, or already scrolled past (a reload mid page): stays visible.
      if (element.getBoundingClientRect().top <= window.innerHeight) continue;
      element.setAttribute("data-reveal-state", "hidden");
      waiting.add(element);
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
      // Never leave anything hidden that will not be observed any more.
      for (const element of waiting) element.removeAttribute("data-reveal-state");
    };
  }, [pathname]);

  return null;
}
