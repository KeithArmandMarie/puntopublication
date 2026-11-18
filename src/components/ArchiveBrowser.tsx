"use client";

import { useState, useSyncExternalStore, type ReactNode } from "react";
import { Button } from "@/components/Button";
import { controlClasses } from "@/components/Field";
import { SectionHeading } from "@/components/SectionHeading";

/** One story in the archive. The card is rendered on the server and passed in. */
export type ArchiveItem = {
  slug: string;
  /** Section slug. */
  section: string;
  /** Municipality slug. */
  municipality: string;
  /** "2026-11" */
  monthKey: string;
  /** "November 2026" */
  monthLabel: string;
  card: ReactNode;
};

export type ArchiveOption = { slug: string; name: string };

type ArchiveBrowserProps = {
  /** Newest first. */
  items: ArchiveItem[];
  sections: ArchiveOption[];
  municipalities: ArchiveOption[];
  /** How many stories show at first and with each press of "Show more stories". */
  pageSize?: number;
};

const FILTER_EVENT = "archive-filter-change";

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(FILTER_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(FILTER_EVENT, onChange);
  };
}

const getSearch = () => window.location.search;
const getServerSearch = () => "";

const subscribeNothing = () => () => {};

const chipBase =
  "press inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold underline-offset-4 hover:underline";
const chipOff = "border-border-strong bg-transparent text-foreground hover:bg-surface";
const chipOn = "border-foreground bg-foreground text-background";

/**
 * The archive list: stories grouped by month, newest first, filtered by section (chips) and
 * municipality (a select). The filter lives in the address (`?section=news&municipality=hagonoy`)
 * and is read in the browser, so the page stays static and a filtered view can be shared.
 * Before JavaScript runs, and without it, every story is listed. After that only the newest
 * `pageSize` show, and "Show more stories" adds more.
 */
export function ArchiveBrowser({
  items,
  sections,
  municipalities,
  pageSize = 20,
}: ArchiveBrowserProps) {
  const search = useSyncExternalStore(subscribe, getSearch, getServerSearch);
  const hydrated = useSyncExternalStore(
    subscribeNothing,
    () => true,
    () => false,
  );
  const [limit, setLimit] = useState(pageSize);

  const params = new URLSearchParams(search);
  const sectionParam = params.get("section") ?? "all";
  const municipalityParam = params.get("municipality") ?? "all";
  const section = sections.some((s) => s.slug === sectionParam) ? sectionParam : "all";
  const municipality = municipalities.some((m) => m.slug === municipalityParam)
    ? municipalityParam
    : "all";

  function setFilter(key: "section" | "municipality", value: string) {
    const next = new URLSearchParams(window.location.search);
    if (value === "all") next.delete(key);
    else next.set(key, value);
    const query = next.toString();
    window.history.replaceState(
      null,
      "",
      query ? `${window.location.pathname}?${query}` : window.location.pathname,
    );
    window.dispatchEvent(new Event(FILTER_EVENT));
    setLimit(pageSize);
  }

  function clearFilters() {
    window.history.replaceState(null, "", window.location.pathname);
    window.dispatchEvent(new Event(FILTER_EVENT));
    setLimit(pageSize);
  }

  const filtered = items.filter(
    (item) =>
      (section === "all" || item.section === section) &&
      (municipality === "all" || item.municipality === municipality),
  );
  const visible = hydrated ? filtered.slice(0, limit) : filtered;
  const hasMore = visible.length < filtered.length;

  const groups: { key: string; label: string; items: ArchiveItem[] }[] = [];
  for (const item of visible) {
    const last = groups[groups.length - 1];
    if (last && last.key === item.monthKey) last.items.push(item);
    else groups.push({ key: item.monthKey, label: item.monthLabel, items: [item] });
  }

  const noun = filtered.length === 1 ? "story" : "stories";
  const status =
    filtered.length === 0
      ? "No stories match these filters."
      : hasMore
        ? `Showing ${visible.length} of ${filtered.length} ${noun}`
        : `${filtered.length} ${noun}`;

  return (
    <div className="lg:grid lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-10">
      <div className="space-y-4 lg:sticky lg:top-[calc(var(--header-height)+1rem)] lg:self-start">
        <div
          role="group"
          aria-label="Filter by section"
          className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch"
        >
          <button
            type="button"
            aria-pressed={section === "all"}
            onClick={() => setFilter("section", "all")}
            className={`${chipBase} ${section === "all" ? chipOn : chipOff}`}
          >
            All stories
          </button>
          {sections.map((entry) => (
            <button
              key={entry.slug}
              type="button"
              aria-pressed={section === entry.slug}
              onClick={() => setFilter("section", entry.slug)}
              className={`${chipBase} ${section === entry.slug ? chipOn : chipOff}`}
            >
              {entry.name}
            </button>
          ))}
        </div>

        <div className="flex max-w-xs flex-col gap-1 lg:max-w-none">
          <label htmlFor="archive-municipality" className="text-sm font-semibold">
            Municipality
          </label>
          <select
            id="archive-municipality"
            value={municipality}
            onChange={(event) => setFilter("municipality", event.target.value)}
            className={controlClasses}
          >
            <option value="all">All municipalities</option>
            {municipalities.map((entry) => (
              <option key={entry.slug} value={entry.slug}>
                {entry.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <p role="status" className="mt-6 text-sm text-muted lg:mt-0">
          {status}
        </p>

        {filtered.length === 0 ? (
          <Button variant="secondary" onClick={clearFilters} className="mt-4">
            Show all stories
          </Button>
        ) : (
          <div className="mt-6 space-y-14">
            {groups.map((group) => (
              <section key={group.key} aria-labelledby={`archive-${group.key}`}>
                <SectionHeading title={group.label} id={`archive-${group.key}`} />
                <ul className="divide-y divide-border">
                  {group.items.map((item) => (
                    <li key={item.slug} className="py-4">
                      {item.card}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}

        {hasMore ? (
          <Button
            variant="secondary"
            onClick={() => setLimit((current) => current + pageSize)}
            className="mt-8"
          >
            Show more stories
          </Button>
        ) : null}
      </div>
    </div>
  );
}
