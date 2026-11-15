"use client";

import { useSyncExternalStore } from "react";

const TIME_ZONE = "Asia/Manila";

const longFormat = new Intl.DateTimeFormat("en-PH", {
  timeZone: TIME_ZONE,
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const shortFormat = new Intl.DateTimeFormat("en-PH", {
  timeZone: TIME_ZONE,
  weekday: "short",
  year: "numeric",
  month: "short",
  day: "numeric",
});

const isoFormat = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function getSnapshot() {
  const now = new Date();
  return [
    isoFormat.format(now),
    longFormat.format(now),
    shortFormat.format(now),
  ].join("|");
}

// The page is built ahead of time, so the date is filled in on the device.
function getServerSnapshot() {
  return "||";
}

function subscribe(onChange: () => void) {
  const id = window.setInterval(onChange, 60_000);
  return () => window.clearInterval(id);
}

/** Today's date in Asia/Manila. Empty until the page loads on the device. */
export function TodayDate() {
  const [iso, long, short] = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  ).split("|");

  return (
    <time dateTime={iso || undefined} className="text-sm text-muted">
      <span className="hidden sm:inline">{long}</span>
      <span className="sm:hidden">{short}</span>
    </time>
  );
}
