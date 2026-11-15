"use client";

import { useState, useSyncExternalStore } from "react";
import { MoonIcon, SunIcon, SystemIcon } from "@/components/icons";
import {
  THEME_CHANGE_EVENT,
  THEME_STORAGE_KEY,
  type ThemeChoice,
} from "@/lib/theme";

const options: {
  value: ThemeChoice;
  label: string;
  Icon: typeof SunIcon;
}[] = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark", label: "Dark", Icon: MoonIcon },
  { value: "system", label: "System", Icon: SystemIcon },
];

// Used when localStorage is blocked, so the toggle still reflects the choice.
let memoryChoice: ThemeChoice = "system";

function readChoice(): ThemeChoice {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    return "system";
  } catch {
    return memoryChoice;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function writeChoice(choice: ThemeChoice) {
  memoryChoice = choice;
  try {
    if (choice === "system") {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
    } else {
      window.localStorage.setItem(THEME_STORAGE_KEY, choice);
    }
  } catch {
    // Storage is blocked. The choice lasts for this page only.
  }
  window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
}

export function ThemeToggle() {
  const choice = useSyncExternalStore<ThemeChoice>(
    subscribe,
    readChoice,
    () => "system",
  );
  const [announcement, setAnnouncement] = useState("");

  return (
    <div role="group" aria-label="Theme" className="flex items-center">
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-pressed={choice === value}
          aria-label={`${label} theme`}
          title={`${label} theme`}
          onClick={() => {
            writeChoice(value);
            setAnnouncement(`Theme set to ${label.toLowerCase()}`);
          }}
          className="inline-flex size-11 items-center justify-center rounded-md text-foreground hover:bg-border aria-pressed:bg-accent aria-pressed:text-on-accent"
        >
          <Icon />
        </button>
      ))}
      <span role="status" className="sr-only">
        {announcement}
      </span>
    </div>
  );
}
