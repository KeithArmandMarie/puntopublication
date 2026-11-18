"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { CloseIcon, MenuIcon, SearchIcon } from "@/components/icons";
import { Logo } from "@/components/Logo";
import { NavLink } from "@/components/NavLink";
import { mainNav, searchHref } from "@/config/site";

const rowClass =
  "flex min-h-14 w-full items-center justify-between gap-3 text-lg font-semibold text-foreground hover:underline aria-[current=page]:underline";

/**
 * Phone and tablet menu. A native modal dialog gives the focus trap, Escape
 * to close and an inert page behind it. Focus returns to the Menu button.
 * The `sheet` class in globals.css fades it in and out with a small move.
 * `children` (the call to action buttons, rendered on the server) sit under the links.
 */
export function MobileMenu({ children }: { children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    if (!dialog) return;

    dialog.showModal();
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";

    const wide = window.matchMedia("(min-width: 64rem)");
    const onChange = () => {
      if (wide.matches) dialog.close();
    };
    wide.addEventListener("change", onChange);

    return () => {
      root.style.overflow = previousOverflow;
      wide.removeEventListener("change", onChange);
      if (dialog.open) dialog.close();
    };
  }, [open]);

  function close() {
    dialogRef.current?.close();
  }

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="press inline-flex min-h-11 items-center gap-2 rounded-full border border-border-strong px-3 font-semibold text-foreground hover:bg-surface lg:hidden"
      >
        <MenuIcon />
        Menu
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Main menu"
        data-lenis-prevent
        onClose={() => {
          setOpen(false);
          // Some browsers do not focus a button on click, so return focus here.
          buttonRef.current?.focus();
        }}
        className="sheet m-0 h-dvh max-h-none w-dvw max-w-none overflow-hidden border-0 bg-background p-0 text-foreground open:flex open:flex-col"
      >
        <div className="border-b border-border">
          <div className="container-page flex h-header items-center justify-between">
            <Logo onNavigate={close} />
            <button
              type="button"
              autoFocus
              onClick={close}
              className="press inline-flex min-h-11 items-center gap-2 rounded-full border border-border-strong px-3 font-semibold hover:bg-surface"
            >
              <CloseIcon />
              Close
            </button>
          </div>
        </div>

        <nav
          aria-label="Main menu"
          className="container-page flex-1 overflow-y-auto pb-12 pt-2"
        >
          <ul>
            {mainNav.map((entry) => (
              <li key={entry.href} className="border-b border-border">
                <NavLink href={entry.href} onClick={close} className={rowClass}>
                  {entry.label}
                </NavLink>
              </li>
            ))}
            <li className="border-b border-border">
              <NavLink href={searchHref} onClick={close} className={rowClass}>
                Search
                <SearchIcon />
              </NavLink>
            </li>
          </ul>
          {children}
        </nav>
      </dialog>
    </>
  );
}
