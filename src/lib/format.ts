/**
 * Dates are always shown in Philippine time (Asia/Manila), whatever the
 * server or the reader's device uses. No server only code, so client
 * components can import it.
 */

const dateFormat = new Intl.DateTimeFormat("en-PH", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "Asia/Manila",
});

/** "November 13, 2026". Takes "2026-11-13" or "2026-11-13T09:00:00+08:00". */
export function formatDate(iso: string): string {
  return dateFormat.format(new Date(iso));
}

/** "5 min read" */
export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}
