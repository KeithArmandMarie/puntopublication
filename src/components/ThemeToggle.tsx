"use client";

import { useState, useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/components/icons";
import { THEME_CHANGE_EVENT, THEME_STORAGE_KEY } from "@/lib/theme";

/** The theme on screen, as set on the html element by the inline head script. */
function readIsDark(): boolean {
  return document.documentElement.getAttribute("data-theme") === "dark";
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  media.addEventListener("change", onChange);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
    media.removeEventListener("change", onChange);
  };
}

function saveTheme(theme: "light" | "dark") {
  // Set directly, so the toggle still works when localStorage is blocked.
  document.documentElement.setAttribute("data-theme", theme);
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Storage is blocked. The choice lasts for this page only.
  }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

/**
 * One button that switches between light and dark. The first visit follows
 * the device setting. After the first press the choice is saved.
 */
export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, readIsDark, () => false);
  const [announcement, setAnnouncement] = useState("");

  return (
    <>
      <button
        type="button"
        aria-pressed={isDark}
        aria-label="Dark mode"
        title={isDark ? "Switch to light mode" : "Switch to dark mode"}
        onClick={() => {
          saveTheme(isDark ? "light" : "dark");
          setAnnouncement(isDark ? "Dark mode off" : "Dark mode on");
        }}
        className="press inline-flex size-11 items-center justify-center rounded-full text-foreground hover:bg-border aria-pressed:bg-accent aria-pressed:text-on-accent"
      >
        {/* Shown by CSS from the theme on the html element, so the first paint is already right. */}
        <span className="inline-flex [[data-theme=dark]_&]:hidden">
          <MoonIcon />
        </span>
        <span className="hidden [[data-theme=dark]_&]:inline-flex">
          <SunIcon />
        </span>
      </button>
      <span role="status" className="sr-only">
        {announcement}
      </span>
    </>
  );
}
