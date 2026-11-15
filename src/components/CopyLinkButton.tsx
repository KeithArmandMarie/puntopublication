"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";

type CopyLinkButtonProps = {
  /** The page path, for example "/article/my-story". Used when the site address is not known. */
  path: string;
  /** The full public address of the page, when the site address is known. */
  url?: string;
};

type Status = "idle" | "copied" | "failed";

const messages: Record<Status, string> = {
  idle: "",
  copied: "Copied",
  failed: "Could not copy. Copy the address from the address bar.",
};

/**
 * Copies the story address. The message next to the button is a polite live
 * region that is always in the page, so screen readers announce "Copied".
 */
export function CopyLinkButton({ path, url }: CopyLinkButtonProps) {
  const [status, setStatus] = useState<Status>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    const target = url ?? new URL(path, window.location.origin).href;
    let next: Status = "copied";
    try {
      await navigator.clipboard.writeText(target);
    } catch {
      next = "failed";
    }
    setStatus(next);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus("idle"), 4000);
  }

  return (
    <span className="inline-flex flex-wrap items-center gap-x-3 gap-y-1">
      <Button variant="secondary" onClick={copy}>
        Copy link
      </Button>
      <span role="status" className="text-sm font-semibold text-foreground">
        {messages[status]}
      </span>
    </span>
  );
}
