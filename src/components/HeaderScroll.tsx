"use client";

import { useEffect } from "react";

/** The page must be scrolled this far before the header may hide. */
const HIDE_AFTER = 160;
/** Small scroll movements are ignored, so a tremble does not flicker the header. */
const TOLERANCE = 8;

/**
 * Hide on scroll for the header. Renders nothing.
 *
 * Sets two attributes on the `[data-site-header]` element (see globals.css):
 * `data-stuck` once the page is scrolled past the utility bar (the soft shadow shows), and
 * `data-hidden` while the reader scrolls down. Scrolling up, focus inside the header, being
 * near the top and an open mobile menu all show it. Under reduced motion it never hides.
 */
export function HeaderScroll() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-site-header]");
    if (!header) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let lastY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY;

      header.dataset.stuck = y > 44 ? "true" : "false";

      const focusInside = header.contains(document.activeElement);
      const menuOpen = header.querySelector("dialog[open]") !== null;

      if (reduceMotion.matches || y < HIDE_AFTER || focusInside || menuOpen) {
        header.dataset.hidden = "false";
      } else if (delta > TOLERANCE) {
        header.dataset.hidden = "true";
      } else if (delta < -TOLERANCE) {
        header.dataset.hidden = "false";
      } else {
        return; // too small a move: keep the state and the last position
      }
      lastY = y;
    };

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };
    const show = () => {
      header.dataset.hidden = "false";
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    header.addEventListener("focusin", show);
    return () => {
      window.removeEventListener("scroll", onScroll);
      header.removeEventListener("focusin", show);
      if (frame !== 0) cancelAnimationFrame(frame);
      header.dataset.hidden = "false";
      header.dataset.stuck = "false";
    };
  }, []);

  return null;
}
