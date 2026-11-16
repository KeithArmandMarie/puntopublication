"use client";

import { domAnimation, LazyMotion } from "motion/react";
import * as m from "motion/react-m";
import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
};

/** Small rise, in pixels. */
const RISE_PX = 12;
/** Same curve and length as --ease-out and --duration-slow in globals.css. */
const EASE_OUT = [0.23, 1, 0.32, 1] as const;
const DURATION_S = 0.3;

type Phase = "plain" | "hidden" | "shown";

/**
 * Fades a block in with a small rise (12px, 300ms, ease-out) once, the first
 * time it scrolls into view. No stagger and nothing repeats.
 *
 * Safe by default: the server HTML and the first client render are fully visible,
 * so without JavaScript, or before it loads, nothing is hidden. After mount only
 * blocks that are still below the screen are hidden, then shown as they arrive.
 * Anything already on screen, and everything under reduced motion, stays as is.
 * Only transform and opacity move, so nothing shifts the layout. Hidden text is
 * still found by find in page and read by screen readers.
 *
 * Never wrap the first screen (the banner) or a part that is needed at once.
 */
export function Reveal({ children, className }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("plain");

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;
    // Already on screen when the page arrives, or above it after a reload: leave it alone.
    if (element.getBoundingClientRect().top < window.innerHeight) return;

    // One-time hide of an off screen block after mount.
    setPhase("hidden");
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPhase("shown");
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -8% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <LazyMotion features={domAnimation} strict>
      <m.div
        ref={ref}
        className={className}
        initial={false}
        animate={phase === "hidden" ? { opacity: 0, y: RISE_PX } : { opacity: 1, y: 0 }}
        // Hiding is instant. Only the arrival is animated.
        transition={{ duration: phase === "hidden" ? 0 : DURATION_S, ease: EASE_OUT }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
