"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

type ParallaxProps = {
  children: ReactNode;
  /** How much slower than the page the content moves, as a share of the scroll. Light: 0.1 to 0.2. */
  speed?: number;
  className?: string;
};

/** Extra height, as a share of the parent, kept above and below so the edges never show. */
const OVERSCAN = 0.15;

/**
 * Light parallax for a photo inside a clipped parent (`relative overflow-hidden`). The box is
 * taller than the parent by `OVERSCAN` on each side and slides up to that far while the
 * parent crosses the screen. Transform only. Runs only while the parent is on screen, and
 * not at all under reduced motion. Without JavaScript the photo simply sits still.
 */
export function Parallax({ children, speed = 0.15, className = "" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    const parent = element?.parentElement;
    if (!element || !parent) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) return;

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = parent.getBoundingClientRect();
      // Distance of the parent's centre from the centre of the screen.
      const offset = rect.top + rect.height / 2 - window.innerHeight / 2;
      const limit = rect.height * OVERSCAN;
      const shift = Math.max(-limit, Math.min(limit, -offset * speed));
      element.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(update);
    };

    let listening = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !listening) {
        listening = true;
        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();
      } else if (!entry.isIntersecting && listening) {
        listening = false;
        window.removeEventListener("scroll", onScroll);
      }
    });
    observer.observe(parent);
    window.addEventListener("resize", onScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame !== 0) cancelAnimationFrame(frame);
      element.style.transform = "";
    };
  }, [speed]);

  return (
    <div
      ref={ref}
      className={`absolute inset-x-0 will-change-transform ${className}`.trim()}
      style={{ top: `-${OVERSCAN * 100}%`, bottom: `-${OVERSCAN * 100}%` }}
    >
      {children}
    </div>
  );
}
