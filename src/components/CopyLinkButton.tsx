"use client";

import { useEffect, useRef, useState } from "react";
import { buttonClasses } from "@/components/Button";

type CopyLinkButtonProps = {
  /** The address to copy. Without it, the address of the open page is copied. */
  url?: string;
};

type Status = "idle" | "copied" | "failed";

/** Old browsers and plain http pages have no clipboard API, so fall back to selecting a hidden field. */
function legacyCopy(text: string): boolean {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.appendChild(field);
  field.select();
  let done = false;
  try {
    done = document.execCommand("copy");
  } catch {
    done = false;
  }
  document.body.removeChild(field);
  return done;
}

/** Copies the story address. Shows "Copied" and announces it to screen readers. */
export function CopyLinkButton({ url }: CopyLinkButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copy() {
    const text = url ?? window.location.href;
    let ok = false;
    try {
      await navigator.clipboard.writeText(text);
      ok = true;
    } catch {
      ok = legacyCopy(text);
    }
    setStatus(ok ? "copied" : "failed");
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setStatus("idle"), 3000);
  }

  return (
    <>
      <button type="button" onClick={copy} className={buttonClasses("secondary")}>
        {status === "copied" ? "Copied" : "Copy link"}
      </button>
      <span role="status" className="sr-only">
        {status === "copied" ? "Link copied to the clipboard." : ""}
        {status === "failed" ? "The link could not be copied. Copy the address from the browser." : ""}
      </span>
      {status === "failed" ? (
        <span aria-hidden="true" className="text-sm text-muted">
          Could not copy
        </span>
      ) : null}
    </>
  );
}
