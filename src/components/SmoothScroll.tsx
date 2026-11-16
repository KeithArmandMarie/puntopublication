"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/** Matches `scroll-padding-top` in globals.css: the sticky bar plus 1rem. */
const ANCHOR_OFFSET_PX = -80;

/**
 * Smooth scrolling for the whole site with Lenis. Renders nothing.
 *
 * Off when the reader asks for reduced motion (and it follows that setting if it
 * changes), so those readers keep the browser's own scrolling. Keyboard scrolling,
 * find in page and focus scrolling stay native. In page links (`#top-stories`) glide
 * and stop below the sticky header. A part of the page that must scroll by itself
 * (the mobile menu) carries `data-lenis-prevent`.
 */
export function SmoothScroll() {
  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lenis: Lenis | undefined;

    function start() {
      if (lenis) return;
      lenis = new Lenis({
        autoRaf: true,
        lerp: 0.1,
      });
    }

    // In page links glide to the target and stop below the sticky header. Next's own
    // hash scrolling is stopped, so the two do not fight.
    function onClick(event: MouseEvent) {
      if (!lenis || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href^='#']");
      const hash = link?.getAttribute("href");
      if (!hash || hash.length < 2) return;
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      event.preventDefault();
      event.stopPropagation();
      lenis.scrollTo(target, { offset: ANCHOR_OFFSET_PX });
      history.pushState(null, "", hash);
      // Keyboard users continue from the target, as with a native jump.
      target.setAttribute("tabindex", target.getAttribute("tabindex") ?? "-1");
      target.focus({ preventScroll: true });
    }
    document.addEventListener("click", onClick, true);

    function stop() {
      lenis?.destroy();
      lenis = undefined;
    }

    function sync() {
      if (query.matches) stop();
      else start();
    }

    sync();
    query.addEventListener("change", sync);
    return () => {
      document.removeEventListener("click", onClick, true);
      query.removeEventListener("change", sync);
      stop();
    };
  }, []);

  return null;
}
