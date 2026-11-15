"use client";

import { Children, useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { KeyboardEvent, ReactNode, TouchEvent } from "react";
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "@/components/icons";

type FeaturedSliderProps = {
  /** One element per slide, rendered on the server. The slider only moves between them. */
  children: ReactNode;
  /** Accessible name of the carousel. */
  label: string;
};

const AUTOPLAY_MS = 7000;
const SWIPE_PX = 50;

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const controlClass =
  "inline-flex size-11 items-center justify-center rounded-md border border-border-strong text-foreground hover:bg-surface";

/**
 * The featured stories carousel. All slides sit in one grid cell, so the
 * tallest slide sets the height before any JavaScript runs and nothing jumps.
 * Slides fade with CSS. Autoplay (7 seconds) runs only when the device does
 * not ask for reduced motion, and stops on hover, on focus and on the pause button.
 */
export function FeaturedSlider({ children, label }: FeaturedSliderProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const id = useId();

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  // The server cannot know the setting, so it assumes reduced motion (no autoplay).
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => true,
  );

  const viewportRef = useRef<HTMLDivElement>(null);
  const focusAfterMove = useRef(false);
  const touchStart = useRef<{ x: number; y: number } | null>(null);

  const go = useCallback(
    (target: number) => setIndex(((target % count) + count) % count),
    [count],
  );

  const autoplay = !reducedMotion && playing && !hovered && !focused && count > 1;

  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(() => setIndex((current) => (current + 1) % count), AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [autoplay, index, count]);

  // When an arrow key moved the slide while focus was inside the old one, carry focus to the new one.
  useEffect(() => {
    if (!focusAfterMove.current) return;
    focusAfterMove.current = false;
    viewportRef.current?.querySelector<HTMLElement>(`[data-slide="${index}"] a`)?.focus();
  }, [index]);

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    focusAfterMove.current =
      event.target instanceof Node && !!viewportRef.current?.contains(event.target);
    go(index + (event.key === "ArrowRight" ? 1 : -1));
  }

  function onTouchStart(event: TouchEvent) {
    const touch = event.touches[0];
    touchStart.current = { x: touch.clientX, y: touch.clientY };
  }

  function onTouchEnd(event: TouchEvent) {
    const start = touchStart.current;
    touchStart.current = null;
    if (!start) return;
    const touch = event.changedTouches[0];
    const dx = touch.clientX - start.x;
    const dy = touch.clientY - start.y;
    if (Math.abs(dx) >= SWIPE_PX && Math.abs(dx) > Math.abs(dy) * 1.5) {
      go(index + (dx < 0 ? 1 : -1));
    }
  }

  return (
    <section
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
      onPointerEnter={(event) => event.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false);
      }}
    >
      <div
        ref={viewportRef}
        id={`${id}-slides`}
        // Rotating by itself: stay quiet. Moved by the reader: announce the new slide politely.
        aria-live={autoplay ? "off" : "polite"}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        className="grid touch-pan-y"
      >
        {slides.map((slide, position) => (
          <div
            key={position}
            role="group"
            aria-roledescription="slide"
            aria-label={`${position + 1} of ${count}`}
            data-slide={position}
            inert={position !== index}
            // The incoming slide becomes visible at once (so it can take focus) and fades in.
            // The outgoing slide stays visible while it fades out, then is hidden.
            className={`col-start-1 row-start-1 duration-300 ${
              position === index
                ? "visible opacity-100 transition-opacity"
                : "invisible opacity-0 transition-[opacity,visibility]"
            }`}
          >
            {slide}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-3">
        <button
          type="button"
          onClick={() => {
            setPlaying((value) => !value);
            if (!playing) {
              // Pressing Play is a clear choice: it wins over hover and focus until they happen again.
              setHovered(false);
              setFocused(false);
            }
          }}
          aria-label={playing ? "Pause slideshow" : "Play slideshow"}
          className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border-strong text-foreground hover:bg-surface motion-reduce:hidden sm:px-3"
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
          <span className="hidden text-sm font-semibold sm:inline">{playing ? "Pause" : "Play"}</span>
        </button>

        <div role="group" aria-label="Choose a story" className="flex items-center">
          {slides.map((_, position) => (
            <button
              key={position}
              type="button"
              onClick={() => go(position)}
              aria-label={`Story ${position + 1} of ${count}`}
              aria-current={position === index ? "true" : undefined}
              className="inline-flex size-11 items-center justify-center"
            >
              <span
                aria-hidden="true"
                className={`size-3 rounded-sm border ${
                  position === index
                    ? "border-foreground bg-foreground"
                    : "border-border-strong bg-transparent"
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous story"
            aria-controls={`${id}-slides`}
            className={controlClass}
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next story"
            aria-controls={`${id}-slides`}
            className={controlClass}
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </section>
  );
}
