"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
} from "react";
import { ChevronDownIcon } from "@/components/icons";
import { NavLink } from "@/components/NavLink";
import type { NavLinkItem } from "@/config/site";

type MunicipalitiesMenuProps = {
  label: string;
  items: NavLinkItem[];
  allLink: NavLinkItem;
};

const itemClass =
  "flex min-h-11 items-center px-4 py-2 text-sm hover:bg-surface hover:underline aria-[current=page]:font-bold aria-[current=page]:underline";

/**
 * Disclosure menu. The button toggles a list of links.
 * Escape closes and returns focus to the button. Arrow keys, Home and End
 * move between links. Tabbing out or clicking away closes it.
 */
export function MunicipalitiesMenu({
  label,
  items,
  allLink,
}: MunicipalitiesMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLUListElement>(null);
  const pendingFocus = useRef<"first" | "last" | null>(null);
  const panelId = useId();

  function links(): HTMLAnchorElement[] {
    return Array.from(panelRef.current?.querySelectorAll("a") ?? []);
  }

  useEffect(() => {
    if (!open || !pendingFocus.current) return;
    const all = links();
    (pendingFocus.current === "first" ? all[0] : all[all.length - 1])?.focus();
    pendingFocus.current = null;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  function closeAndReturn() {
    setOpen(false);
    buttonRef.current?.focus();
  }

  function onButtonKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      pendingFocus.current = event.key === "ArrowDown" ? "first" : "last";
      if (open) {
        const all = links();
        (event.key === "ArrowDown" ? all[0] : all[all.length - 1])?.focus();
        pendingFocus.current = null;
      } else {
        setOpen(true);
      }
    }
  }

  function onPanelKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const all = links();
    const index = all.indexOf(document.activeElement as HTMLAnchorElement);
    let next: number | null = null;
    if (event.key === "ArrowDown") next = (index + 1) % all.length;
    if (event.key === "ArrowUp") next = (index - 1 + all.length) % all.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = all.length - 1;
    if (next !== null) {
      event.preventDefault();
      all[next]?.focus();
    }
  }

  function onRootKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape" && open) {
      event.preventDefault();
      closeAndReturn();
    }
  }

  function onRootBlur(event: FocusEvent<HTMLDivElement>) {
    if (!rootRef.current?.contains(event.relatedTarget as Node | null)) {
      setOpen(false);
    }
  }

  return (
    <div
      ref={rootRef}
      className="relative"
      onKeyDown={onRootKeyDown}
      onBlur={onRootBlur}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={onButtonKeyDown}
        className="inline-flex min-h-11 items-center gap-1 px-3 text-sm font-semibold text-foreground hover:underline underline-offset-4 aria-expanded:underline"
      >
        {label}
        <ChevronDownIcon
          className={`size-4 ${open ? "rotate-180" : ""}`.trim()}
        />
      </button>
      <ul
        id={panelId}
        ref={panelRef}
        hidden={!open}
        onKeyDown={onPanelKeyDown}
        className="absolute right-0 top-full z-50 w-64 border border-border bg-background py-1"
      >
        {items.map((item) => (
          <li key={item.href}>
            <NavLink
              href={item.href}
              onClick={() => setOpen(false)}
              className={itemClass}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
        <li className="mt-1 border-t border-border pt-1">
          <NavLink
            href={allLink.href}
            exact
            onClick={() => setOpen(false)}
            className={`${itemClass} font-semibold`}
          >
            {allLink.label}
          </NavLink>
        </li>
      </ul>
    </div>
  );
}
