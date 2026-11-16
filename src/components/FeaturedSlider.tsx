"use client";

import { Children, useCallback, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent, ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon, PauseIcon, PlayIcon } from "@/components/icons";

type FeaturedSliderProps = {
  /** One element per slide, rendered on the server. The slider only moves between them. */
  children: ReactNode;
  /** Accessible name of the carousel. */
  label: string;
};

const AUTOPLAY_MS = 7000;
/** Movement before the swipe direction is chosen. */
const DIRECTION_LOCK_PX = 10;
/** A drag past this share of the slide width changes the slide. */
const SWIPE_FRACTION = 0.2;
/** Or a quick flick, in pixels per millisecond at release. */
const FLICK_SPEED = 0.4;
/** Matches --duration-slow, the longest fade. */
const SETTLE_MS = 300;

const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const controlClass =
  "press inline-flex size-11 items-center justify-center rounded-md border border-border-strong text-foreground hover:bg-surface";

type Drag = {
  pointerId: number;
  startX: number;
  startY: number;
  axis: "x" | null;
  dx: number;
  /** Last sample, for the speed at release. */
  lastX: number;
  lastTime: number;
  speed: number;
};

/**
 * The featured stories carousel. All slides sit in one grid cell, so the
 * tallest slide sets the height before any JavaScript runs and nothing jumps.
 * Slides fade with CSS. Autoplay (7 seconds) runs only when the device does
 * not ask for reduced motion, and stops on hover, on focus, while dragging and
 * on the pause button. A touch swipe moves the slide 1:1 with the finger; the
 * previous and next buttons and the arrow keys do the same without a gesture.
 */
export function FeaturedSlider({ children, label }: FeaturedSliderProps) {
  const slides = Children.toArray(children);
  const count = slides.length;
  const id = useId();

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dragging, setDragging] = useState(false);

  // The server cannot know the setting, so it assumes reduced motion (no autoplay).
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => true,
  );

  const viewportRef = useRef<HTMLDivElement>(null);
  const focusAfterMove = useRef(false);
  const drag = useRef<Drag | null>(null);
  const suppressClick = useRef(false);

  const go = useCallback(
    (target: number) => setIndex(((target % count) + count) % count),
    [count],
  );

  const autoplay = !reducedMotion && playing && !hovered && !focused && !dragging && count > 1;

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

  function slideElement(position: number) {
    return viewportRef.current?.querySelector<HTMLElement>(`[data-slide="${position}"]`) ?? null;
  }

  function onKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    focusAfterMove.current =
      event.target instanceof Node && !!viewportRef.current?.contains(event.target);
    go(index + (event.key === "ArrowRight" ? 1 : -1));
  }

  // Touch and pen only. A mouse uses the buttons, and can still select text.
  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    suppressClick.current = false;
    if (event.pointerType === "mouse" || !event.isPrimary || count < 2) return;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      axis: null,
      dx: 0,
      lastX: event.clientX,
      lastTime: event.timeStamp,
      speed: 0,
    };
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state || event.pointerId !== state.pointerId) return;
    const dx = event.clientX - state.startX;
    const dy = event.clientY - state.startY;

    if (state.axis === null) {
      if (Math.max(Math.abs(dx), Math.abs(dy)) < DIRECTION_LOCK_PX) return;
      if (Math.abs(dy) >= Math.abs(dx)) {
        // Mostly vertical: the page scrolls and the slider lets go.
        drag.current = null;
        return;
      }
      state.axis = "x";
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // The pointer is already gone. The drag still ends on pointerup or pointercancel.
      }
      setDragging(true);
    }

    const elapsed = event.timeStamp - state.lastTime;
    if (elapsed > 0) state.speed = (event.clientX - state.lastX) / elapsed;
    state.lastX = event.clientX;
    state.lastTime = event.timeStamp;
    state.dx = dx;

    // The slider wraps around, so there is no edge to resist at. The slide follows the finger 1:1.
    const slide = slideElement(index);
    if (slide) {
      slide.style.transition = "none";
      slide.style.transform = `translateX(${dx}px)`;
    }
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state || event.pointerId !== state.pointerId) return;
    drag.current = null;
    if (state.axis !== "x") return;

    setDragging(false);
    suppressClick.current = true;

    const width = viewportRef.current?.offsetWidth ?? 1;
    const flicked = Math.abs(state.speed) >= FLICK_SPEED && Math.sign(state.speed) === Math.sign(state.dx);
    const passed =
      event.type !== "pointercancel" && (Math.abs(state.dx) >= width * SWIPE_FRACTION || flicked);

    const slide = slideElement(index);
    if (slide) {
      if (passed) {
        // Fades out from where the finger left it, then the offset is cleared while it is hidden.
        slide.style.transition = "";
        window.setTimeout(() => {
          if (!drag.current) slide.style.transform = "";
        }, SETTLE_MS);
      } else {
        // Not far enough: it settles back into place.
        slide.style.transition = "transform var(--duration-base) var(--ease-out)";
        slide.style.transform = "";
        window.setTimeout(() => {
          if (!drag.current) slide.style.transition = "";
        }, SETTLE_MS);
      }
    }

    if (passed) go(index + (state.dx < 0 ? 1 : -1));
  }

  // A swipe that ends over a link must not open it.
  function onClickCapture(event: MouseEvent<HTMLDivElement>) {
    if (!suppressClick.current) return;
    suppressClick.current = false;
    event.preventDefault();
    event.stopPropagation();
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
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        // A dragged slide must not widen the page. The 8px of room keeps the card's focus ring.
        className="-mx-2 grid touch-pan-y overflow-x-clip px-2"
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
            // The outgoing slide stays visible while it fades out, a little faster, then is hidden.
            className={`col-start-1 row-start-1 ease-out ${
              position === index
                ? "visible opacity-100 transition-opacity duration-(--duration-slow)"
                : "invisible opacity-0 transition-[opacity,visibility] duration-(--duration-base)"
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
          className="press inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-md border border-border-strong text-foreground hover:bg-surface motion-reduce:hidden sm:px-3"
        >
          {playing ? <PauseIcon /> : <PlayIcon />}
          <span className="hidden text-sm font-semibold sm:inline">{playing ? "Pause" : "Play"}</span>
        </button>

        {/* Phones: a plain count, because five 44px dots and the other controls do not fit. */}
        <p aria-hidden="true" className="text-sm text-muted sm:hidden">
          {index + 1} of {count}
        </p>

        <div role="group" aria-label="Choose a story" className="hidden items-center gap-2 sm:flex">
          {slides.map((_, position) => (
            <button
              key={position}
              type="button"
              onClick={() => go(position)}
              aria-label={`Story ${position + 1} of ${count}`}
              aria-current={position === index ? "true" : undefined}
              className="press group/dot inline-flex size-11 items-center justify-center rounded-md"
            >
              <span
                aria-hidden="true"
                className={`size-3 rounded-sm border transition-colors duration-(--duration-fast) ease-out ${
                  position === index
                    ? "border-foreground bg-foreground"
                    : "border-border-strong bg-transparent group-hover/dot:bg-border"
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
